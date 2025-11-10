import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUp } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { FormError } from "./form-error";
import { FormField } from "./form-field";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

type SignUpFormProps = {
  onToggleMode: () => void;
};

export const SignUpForm = ({ onToggleMode }: SignUpFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    startTransition(async () => {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        setError("root", {
          message: result.error.message || "Sign up failed",
        });
        return;
      }
      router.push("/admin");
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        disabled={isPending}
        error={errors.name?.message}
        icon={<User className="size-4" />}
        id="name"
        label="Name"
        placeholder="John Doe"
        register={register("name")}
        type="text"
      />

      <FormField
        disabled={isPending}
        error={errors.email?.message}
        icon={<Mail className="size-4" />}
        id="signup-email"
        label="Email"
        placeholder="you@example.com"
        register={register("email")}
        type="email"
      />

      <FormField
        disabled={isPending}
        error={errors.password?.message}
        icon={<Lock className="size-4" />}
        id="signup-password"
        label="Password"
        placeholder="••••••••"
        register={register("password")}
        type="password"
      />

      <FormField
        disabled={isPending}
        error={errors.confirmPassword?.message}
        icon={<Lock className="size-4" />}
        id="confirm-password"
        label="Confirm Password"
        placeholder="••••••••"
        register={register("confirmPassword")}
        type="password"
      />

      {errors.root && <FormError message={errors.root.message} />}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <button
          className="font-medium text-primary hover:underline"
          onClick={onToggleMode}
          type="button"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};
