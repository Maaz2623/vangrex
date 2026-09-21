import { requireAuth, requireUnAuth } from "@/features/auth/lib/auth-utils";
import { HomeView } from "@/features/home/components/home-view";
import React from "react";

const HomePage = async () => {
  await requireUnAuth();

  return <HomeView />;
};

export default HomePage;
