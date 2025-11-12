import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "@/env";
import { generateFileKey, getPublicUrl, r2Client } from "@/lib/r2";
import { protectedProcedure, publicProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";

export const fileRouter = router({
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.string().min(1),
        folder: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const key = generateFileKey(input.filename, input.folder);

      try {
        const command = new PutObjectCommand({
          Bucket: env.CLOUDFLARE_R2_BUCKET,
          Key: key,
          ContentType: input.contentType,
        });

        const uploadUrl = await getSignedUrl(r2Client, command, {
          expiresIn: 3600,
        });

        return {
          uploadUrl,
          key,
          publicUrl: getPublicUrl(key),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload URL",
          cause: error,
        });
      }
    }),

  uploadFile: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.string().min(1),
        content: z.string(),
        folder: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const key = generateFileKey(input.filename, input.folder);

      try {
        const buffer = Buffer.from(input.content, "base64");

        await r2Client.send(
          new PutObjectCommand({
            Bucket: env.CLOUDFLARE_R2_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: input.contentType,
          })
        );

        return {
          key,
          publicUrl: getPublicUrl(key),
          size: buffer.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
          cause: error,
        });
      }
    }),

  listFiles: protectedProcedure
    .input(
      z.object({
        prefix: z.string().optional(),
        maxKeys: z.number().min(1).max(1000).default(100),
        continuationToken: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const command = new ListObjectsV2Command({
          Bucket: env.CLOUDFLARE_R2_BUCKET,
          Prefix: input.prefix,
          MaxKeys: input.maxKeys,
          ContinuationToken: input.continuationToken,
        });

        const response = await r2Client.send(command);

        return {
          files:
            response.Contents?.map((item) => ({
              key: item.Key,
              publicUrl: getPublicUrl(item.Key ?? ""),
              size: item.Size,
              lastModified: item.LastModified,
            })) ?? [],
          nextContinuationToken: response.NextContinuationToken,
          isTruncated: response.IsTruncated ?? false,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list files",
          cause: error,
        });
      }
    }),

  getFile: publicProcedure
    .input(
      z.object({
        key: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const command = new GetObjectCommand({
          Bucket: env.CLOUDFLARE_R2_BUCKET,
          Key: input.key,
        });

        const response = await r2Client.send(command);

        return {
          key: input.key,
          publicUrl: getPublicUrl(input.key),
          contentType: response.ContentType,
          size: response.ContentLength,
          lastModified: response.LastModified,
        };
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
          cause: error,
        });
      }
    }),

  deleteFile: protectedProcedure
    .input(
      z.object({
        key: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: env.CLOUDFLARE_R2_BUCKET,
            Key: input.key,
          })
        );

        return {
          success: true,
          key: input.key,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
          cause: error,
        });
      }
    }),

  deleteFiles: protectedProcedure
    .input(
      z.object({
        keys: z.array(z.string().min(1)).min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const results = await Promise.allSettled(
          input.keys.map((key) =>
            r2Client.send(
              new DeleteObjectCommand({
                Bucket: env.CLOUDFLARE_R2_BUCKET,
                Key: key,
              })
            )
          )
        );

        const succeeded = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;

        return {
          succeeded,
          failed,
          total: input.keys.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete files",
          cause: error,
        });
      }
    }),
});

export type FileRouter = typeof fileRouter;
