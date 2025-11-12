"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { Mail, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSession } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEnumLabel } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useTrpcInvalidations } from "@/trpc/use-trpc-invalidations";

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email"),
  role: z.nativeEnum(UserRole),
});

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email"),
  role: z.nativeEnum(UserRole),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  _count: {
    sessions: number;
    authors: number;
  };
};

type UserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserType | null;
};

export const UserDialog = ({ open, onOpenChange, user }: UserDialogProps) => {
  const { invalidateUserGraph } = useTrpcInvalidations();
  const { data: session } = useSession();
  const [generatedPassword, setGeneratedPassword] = useState("");

  const isEditingSelf = !!(user && session?.user?.id === user.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || UserRole.VIEWER,
    },
  });

  const role = watch("role");

  useEffect(() => {
    if (open && !user) {
      const password = generatePassword();
      setGeneratedPassword(password);
      reset({
        name: "",
        email: "",
        role: UserRole.VIEWER,
      });
    } else if (open && user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setGeneratedPassword("");
    }
  }, [open, user, reset]);

  const createUser = trpc.cms.user.create.useMutation({
    onSuccess: async () => {
      toast.success("User created successfully");
      await invalidateUserGraph();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const updateUser = trpc.cms.user.update.useMutation({
    onSuccess: async () => {
      toast.success("User updated successfully");
      await invalidateUserGraph();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const onSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (user) {
      updateUser.mutate({ id: user.id, ...data });
    } else {
      createUser.mutate(data as CreateUserFormData);
    }
  };

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update the user information below."
              : "Add a new user to your system. A password will be auto-generated."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                id="name"
                placeholder="John Doe"
                {...register("name")}
                aria-invalid={!!errors.name}
                disabled={isPending}
              />
            </div>
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                id="email"
                placeholder="john@example.com"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                disabled={isPending || isEditingSelf}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
            {isEditingSelf && (
              <p className="text-muted-foreground text-xs">
                You cannot change your own email address
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-destructive">*</span>
            </Label>
            <Select
              disabled={isPending || isEditingSelf}
              onValueChange={(value) => setValue("role", value as UserRole)}
              value={role}
            >
              <SelectTrigger className="w-full" id="role">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((roleValue) => (
                  <SelectItem key={roleValue} value={roleValue}>
                    {formatEnumLabel(roleValue)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-destructive text-sm">{errors.role.message}</p>
            )}
            {isEditingSelf && (
              <p className="text-muted-foreground text-xs">
                You cannot change your own role
              </p>
            )}
          </div>

          {!user && generatedPassword && (
            <div className="space-y-2 rounded-md border bg-muted/50 p-4">
              <Label>Generated Password</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="font-mono text-sm"
                  readOnly
                  value={generatedPassword}
                />
                <CopyButton textToCopy={generatedPassword} />
              </div>
              <p className="text-muted-foreground text-xs">
                Save this password securely. It will not be shown again.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving..." : user ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
