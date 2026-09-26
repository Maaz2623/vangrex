"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, File, Paperclip, Upload, X } from "lucide-react";

import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { InputNode } from "./input-node.types";

export const InputNodeUI = ({ id, data }: NodeProps<InputNode>) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updateNode } = useReactFlow();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(true);
  };

  const handleValueChange = (value: string) => {
    updateNode(id, {
      data: {
        ...data,
        value,
      },
    });
  };

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    setFiles((current) => [...current, ...Array.from(newFiles)]);
  };

  const removeFile = (index: number) => {
    setFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const inputContent = (
    <div className="space-y-6">
      {/* Text input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Text input</label>

          <span className="text-[11px] text-muted-foreground">
            {data.value.length} characters
          </span>
        </div>

        <div className="rounded-xl border bg-muted/20 p-1">
          <Input
            value={data.value}
            placeholder="Enter the value you want to pass into the workflow..."
            onChange={(event) => handleValueChange(event.target.value)}
            className="h-11 border-0 bg-background shadow-sm focus-visible:ring-1"
          />
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          This value will be available to the next connected node.
        </p>
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <div>
          <label className="text-sm font-medium">Attachments</label>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Add files that should be included with this workflow input.
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="group rounded-xl border border-dashed bg-muted/20 p-6 text-center transition-colors hover:border-foreground/20 hover:bg-muted/40"
        >
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl border bg-background shadow-sm transition-transform group-hover:scale-105">
            <Upload className="size-4 text-muted-foreground" />
          </div>

          <div className="mt-3">
            <p className="text-sm font-medium">Drop files here</p>

            <p className="mt-1 text-xs text-muted-foreground">
              or choose files from your device
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 h-8 gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-3.5" />
            Choose files
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Attached files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Attached files
            </p>

            <span className="text-[11px] text-muted-foreground">
              {files.length} {files.length === 1 ? "file" : "files"}
            </span>
          </div>

          <div className="space-y-1.5">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="group flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 transition-colors hover:bg-muted/30"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <File className="size-3.5 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{file.name}</p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 opacity-60 transition-opacity hover:opacity-100"
                  onClick={() => removeFile(index)}
                >
                  <X className="size-3.5" />

                  <span className="sr-only">Remove {file.name}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Canvas Node */}
      <div
        onDoubleClick={handleDoubleClick}
        className="w-[240px] cursor-pointer overflow-visible rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ArrowDown className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Input</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Workflow input
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="relative h-[90px] border-y">
          <Handle
            type="source"
            position={Position.Right}
            id="output"
            className="!right-0 !size-2.5 !translate-x-1/2"
          />

          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
            Output
          </span>
        </div>

        {/* Footer */}
        <div className="px-4 py-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Provides data to the workflow.
          </p>
        </div>
      </div>

      {/* Desktop Dialog */}
      {!isMobile && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
            <DialogHeader className="border-b px-6 py-5">
              <DialogTitle className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <ArrowDown className="size-4 text-muted-foreground" />
                </div>
                Workflow Input
              </DialogTitle>

              <DialogDescription className="pl-10">
                Provide text or attach files to use as workflow input.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              {inputContent}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b px-4 pb-4 text-left">
              <DrawerTitle className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <ArrowDown className="size-4 text-muted-foreground" />
                </div>
                Workflow Input
              </DrawerTitle>

              <DrawerDescription className="pl-10">
                Provide text or attach files to use as workflow input.
              </DrawerDescription>
            </DrawerHeader>

            <div className="max-h-[75vh] overflow-y-auto px-4 py-5">
              {inputContent}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
