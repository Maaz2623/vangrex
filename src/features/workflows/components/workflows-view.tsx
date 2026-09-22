"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { WorkflowsHeader } from "./workflows-header";
import { WorkflowsList } from "./workflows-list";

export const WorkflowsView = () => {
  const [search, setSearch] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="space-y-2.5 md:pl-2.5 pt-2.5"
    >
      <WorkflowsHeader search={search} setSearch={setSearch} />

      <WorkflowsList search={search} setSearch={setSearch} />
    </motion.div>
  );
};
