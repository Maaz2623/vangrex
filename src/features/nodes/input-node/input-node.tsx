"use client";

import { useRef, useState } from "react";

import { ArrowDown, File, Paperclip, Upload, X } from "lucide-react";

import {
  Handle,
  NodeProps,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";

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
    <div className="space-y-5">
      {/* Text input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Input</label>

        <Input
          value={data.value}
          placeholder="Enter a value..."
          onChange={(event) => handleValueChange(event.target.value)}
        />
      </div>

      {/* File upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Files</label>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50"
        >
          <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-muted">
            <Upload className="size-4 text-muted-foreground" />
          </div>

          <p className="mt-3 text-sm font-medium">Drop files here</p>

          <p className="mt-1 text-xs text-muted-foreground">
            or choose files from your device
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="mr-2 size-3.5" />
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

      {/* Selected files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Attached files
          </p>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <File className="size-3.5 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{file.name}</p>

                  <p className="text-[11px] text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
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
      <div
        onDoubleClick={handleDoubleClick}
        className="group relative min-w-[230px] cursor-pointer rounded-xl border bg-background shadow-sm transition-all duration-200 hover:border-foreground/20 hover:shadow-md"
      >
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!size-3 !border-2 !border-background !bg-muted-foreground"
        />

        <span className="absolute -right-14 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
          Value
        </span>

        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ArrowDown className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none">Input</p>

            <p className="mt-1 text-xs text-muted-foreground">Workflow input</p>
          </div>
        </div>

        <div className="border-t" />

        <div className="px-4 py-3">
          <Input
            value={data.value}
            placeholder="Enter a value..."
            className="h-9 text-xs"
            onChange={(event) => handleValueChange(event.target.value)}
            onDoubleClick={(event) => event.stopPropagation()}
          />
        </div>
      </div>

      {/* Desktop */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                <ArrowDown className="size-4 text-muted-foreground" />
              </div>
              Workflow Input
            </DialogTitle>

            <DialogDescription>
              Provide text or attach files to use as workflow input.
            </DialogDescription>
          </DialogHeader>

          {inputContent}
        </DialogContent>
      </Dialog>

      {/* Mobile */}
      <Drawer open={isMobile && open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                <ArrowDown className="size-4 text-muted-foreground" />
              </div>
              Workflow Input
            </DrawerTitle>

            <DrawerDescription>
              Provide text or attach files to use as workflow input.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6">{inputContent}</div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
