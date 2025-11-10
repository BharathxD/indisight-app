import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { FormError } from "./form-error";
import { FormField } from "./form-field";

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

type SignInFormProps = {
  onToggleMode?: () => void;
  showToggle?: boolean;
};

export const SignInForm = ({ onToggleMode, showToggle }: SignInFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    startTransition(async () => {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError("root", {
          message: result.error.message || "Invalid credentials",
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
        error={errors.email?.message}
        icon={<Mail className="size-4" />}
        id="email"
        label="Email"
        placeholder="you@example.com"
        register={register("email")}
        type="email"
      />

      <FormField
        disabled={isPending}
        error={errors.password?.message}
        icon={<Lock className="size-4" />}
        id="password"
        label="Password"
        placeholder="••••••••"
        register={register("password")}
        type="password"
      />

      {errors.root && <FormError message={errors.root.message} />}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Signing in..." : "Sign In"}
      </Button>

      {showToggle && onToggleMode && (
        <p className="text-center text-muted-foreground text-sm">
          Don't have an account?{" "}
          <button
            className="font-medium text-primary hover:underline"
            onClick={onToggleMode}
            type="button"
          >
            Sign up
          </button>
        </p>
      )}
    </form>
  );
};
