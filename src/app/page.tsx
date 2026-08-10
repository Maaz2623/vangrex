import { HomePage } from "@/features/home/components/home-page";
import { UnRequireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await UnRequireAuth();
  return <HomePage />;
};

export default Page;
