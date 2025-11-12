import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export const getPublicUrl = (key: string) =>
  `${env.NEXT_PUBLIC_CLOUDFLARE_R2_URL}/${key}`;

export const generateFileKey = (filename: string, folder?: string) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = folder
    ? `${folder}/${timestamp}-${randomString}-${sanitizedFilename}`
    : `${timestamp}-${randomString}-${sanitizedFilename}`;
  return key;
};
