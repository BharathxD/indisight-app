import { AuthContent } from "@/components/auth/content";
import { getSignupEnabled } from "@/lib/auth-config";

const AuthPage = async () => {
  const signupEnabled = getSignupEnabled();
  return <AuthContent signupEnabled={signupEnabled} />;
};

export default AuthPage;
