"use client";

import { useState } from "react";
import { WorkflowsHeader } from "./workflows-header";
import { WorkflowsList } from "./workflows-list";

export const WorkflowsView = () => {

  const [search, setSearch] = useState("");

  return (
    <div className="pl-2.5 pt-2.5 space-y-2.5">
      <WorkflowsHeader search={search} setSearch={setSearch} />
      <WorkflowsList search={search} setSearch={setSearch} />
    </div>
  );
};
