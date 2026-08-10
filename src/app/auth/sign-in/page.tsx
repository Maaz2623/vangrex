import { SignInForm } from "@/features/auth/components/sign-in-form";
import { UnRequireAuth } from "@/lib/auth-utils";

const SignInPage = async () => {
  await UnRequireAuth();

  return <SignInForm />;
};

export default SignInPage;
