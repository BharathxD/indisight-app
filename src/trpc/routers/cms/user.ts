import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@/auth/server";
import { adminProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const normalizeEmail = (email: string) => email.toLowerCase().trim();

const listUsersSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email format").transform(normalizeEmail),
  role: z.nativeEnum(UserRole).default(UserRole.VIEWER),
});

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  email: z
    .string()
    .email("Invalid email format")
    .transform(normalizeEmail)
    .optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export const userRouter = router({
  list: adminProcedure.input(listUsersSchema).query(async ({ input, ctx }) => {
    const { role, isActive, search, limit, cursor } = input;

    const where = {
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const users = await ctx.db.user.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            sessions: true,
            authors: true,
          },
        },
      },
    });

    let nextCursor: string | undefined;
    if (users.length > limit) {
      const nextItem = users.pop();
      nextCursor = nextItem?.id;
    }

    return { users, nextCursor };
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          sessions: {
            select: {
              id: true,
              createdAt: true,
              expiresAt: true,
              ipAddress: true,
              userAgent: true,
            },
            orderBy: { createdAt: "desc" },
          },
          authors: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              sessions: true,
              authors: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  create: adminProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
        select: { id: true },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with this email already exists",
        });
      }

      const password = generatePassword();
      let createdUserId: string | null = null;

      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password,
            name: input.name,
          },
        });

        if (!result?.user?.id) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user account",
          });
        }

        createdUserId = result.user.id;

        await ctx.db.user.update({
          where: { id: createdUserId },
          data: { role: input.role },
        });

        const user = await ctx.db.user.findUnique({
          where: { id: createdUserId },
          include: {
            _count: {
              select: {
                sessions: true,
                authors: true,
              },
            },
          },
        });

        return { user, password };
      } catch (error) {
        if (createdUserId) {
          await ctx.db.user
            .delete({ where: { id: createdUserId } })
            .catch(() => {
              // do nothing
            });
        }

        if (error instanceof TRPCError) {
          throw error;
        }

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        if (
          errorMessage.toLowerCase().includes("email") &&
          errorMessage.toLowerCase().includes("already")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A user with this email already exists",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user account",
        });
      }
    }),

  update: adminProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const isSelfUpdate = id === ctx.user.id;

      if (isSelfUpdate && data.role && data.role !== existing.role) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot change your own role",
        });
      }

      if (isSelfUpdate && data.email && data.email !== existing.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot change your own email",
        });
      }

      if (
        data.role &&
        data.role !== existing.role &&
        existing.role === UserRole.SUPER_ADMIN
      ) {
        const superAdminCount = await ctx.db.user.count({
          where: { role: UserRole.SUPER_ADMIN },
        });

        if (superAdminCount <= 1) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Cannot demote the last Super Admin",
          });
        }
      }

      if (data.email && data.email !== existing.email) {
        const emailInUse = await ctx.db.user.findUnique({
          where: { email: data.email },
          select: { id: true },
        });

        if (emailInUse && emailInUse.id !== id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This email is already in use by another user",
          });
        }
      }

      return ctx.db.user.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          role: true,
          _count: {
            select: {
              authors: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (input.id === ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot delete your own account",
        });
      }

      if (user.role === UserRole.SUPER_ADMIN) {
        const superAdminCount = await ctx.db.user.count({
          where: { role: UserRole.SUPER_ADMIN },
        });

        if (superAdminCount <= 1) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Cannot delete the last Super Admin",
          });
        }
      }

      if (user._count.authors > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete user with ${user._count.authors} associated author(s)`,
        });
      }

      await ctx.db.user.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
