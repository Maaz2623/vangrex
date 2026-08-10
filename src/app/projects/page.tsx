import { requireAuth } from "@/lib/auth-utils";
import React from "react";

const ProjectsPage = async () => {
  await requireAuth();

  return <div>Projects</div>;
};

export default ProjectsPage;
