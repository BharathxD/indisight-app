"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, KeyRound, Loader2, Lock, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient, useSession } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const ChangePasswordForm = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);

    try {
      const result = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully");
        reset();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <KeyRound className="size-4 text-muted-foreground" />
              <span>Current Password</span>
            </div>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <p className="text-destructive text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Lock className="size-4 text-muted-foreground" />
              <span>New Password</span>
            </div>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-destructive text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <LockKeyhole className="size-4 text-muted-foreground" />
              <span>Confirm New Password</span>
            </div>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
