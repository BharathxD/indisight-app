import { Suspense } from "react";
import { AuthContent } from "@/components/auth/content";
import { getSignupEnabled } from "@/lib/auth-config";

const AuthPage = async () => {
  const signupEnabled = getSignupEnabled();
  return (
    <Suspense>
      <AuthContent signupEnabled={signupEnabled} />
    </Suspense>
  );
};

export default AuthPage;
