"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthContentProps = {
  signupEnabled?: boolean;
};

export const AuthContent = ({ signupEnabled = false }: AuthContentProps) => {
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringLiteral(["signin", "signup"]).withDefault("signin")
  );

  const isSignIn = mode === "signin";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xs">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isSignIn ? "Sign In" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {isSignIn
              ? "Enter your credentials to access your account"
              : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignIn ? (
            <SignInForm
              onToggleMode={() => setMode("signup")}
              showToggle={signupEnabled}
            />
          ) : (
            <SignUpForm onToggleMode={() => setMode("signin")} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
