"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useCreateWorkflow, useUpdateWorkflow } from "../hooks/use-workflows";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultName: string;
  defaultDescription: string | null;
  workflowId: string;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
};

export const UpdateWorkflowDialog = ({
  open,
  setOpen,
  defaultName,
  defaultDescription,
  workflowId,
}: Props) => {
  const isMobile = useIsMobile();

  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);

  const updateMutaiton = useUpdateWorkflow();

  const router = useRouter();

  const handleSubmit = () => {
    if (!name.trim()) return;

    updateMutaiton.mutate(
      {
        name: name,
        description: description || "",
        workflowId: workflowId,
      },
      {
        onSuccess: (data) => {
          toast.success("Workflow updated.");
        },
        onError: () => {
          toast.error("Something went wrong.");
        },
      },
    );

    setOpen(false);
  };

  const form = (
    <div className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="workflow-name">Workflow name</Label>

        <Input
          id="workflow-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Process customer signup"
          autoComplete="off"
          autoFocus={!isMobile}
        />

        <p className="text-xs text-muted-foreground">
          Give your workflow a clear, recognizable name.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="workflow-description">
          Description
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        </Label>

        <Textarea
          id="workflow-description"
          value={description || ""}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What does this workflow do?"
          className="min-h-24 resize-none"
        />

        <p className="text-xs text-muted-foreground">
          A short description helps you identify the workflow later.
        </p>
      </div>
    </div>
  );

  const actions = (
    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>

      <Button type="button" disabled={!name.trim()} onClick={handleSubmit}>
        Update
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Create workflow</DrawerTitle>
            <DrawerDescription>
              Start with a name and optional description.
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-2">{form}</div>

          <DrawerFooter className="pt-4">{actions}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit workflow</DialogTitle>
          <DialogDescription>
            Update the name and description of your workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">{form}</div>

        <div className="pt-2">{actions}</div>
      </DialogContent>
    </Dialog>
  );
};
