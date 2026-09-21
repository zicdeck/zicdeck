"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, ChevronDown, FileText, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatComposerModel {
  id: string;
  name: string;
  provider?: string;
}

export interface ChatComposerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (message: string, files: File[], model: string) => void;
  placeholder?: string;
  models?: ChatComposerModel[];
  selectedModel?: string;
  defaultModel?: string;
  onModelChange?: (modelId: string) => void;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  acceptedFileTypes?: string[];
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  maxFiles?: number;
}

const DEFAULT_MODELS: ChatComposerModel[] = [
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek" },
  { id: "claude-3-7-sonnet", name: "Claude 3.7 Sonnet", provider: "Anthropic" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google" },
];

export function ChatComposer({
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  placeholder = "Ask ZicDeck anything, @ to add deck or context, / for slide commands...",
  models = DEFAULT_MODELS,
  selectedModel: controlledModel,
  defaultModel,
  onModelChange,
  files: controlledFiles,
  onFilesChange,
  acceptedFileTypes = [".txt", ".pdf"],
  disabled = false,
  isLoading = false,
  className,
  maxFiles = 5,
}: ChatComposerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [internalModel, setInternalModel] = useState(
    defaultModel || (models[0]?.id ?? "")
  );
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const text = value !== undefined ? value : internalValue;
  const currentFiles = controlledFiles !== undefined ? controlledFiles : internalFiles;
  const currentModelId = controlledModel !== undefined ? controlledModel : internalModel;

  const currentModel =
    models.find((m) => m.id === currentModelId) || models[0] || {
      id: currentModelId,
      name: currentModelId,
    };

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 220);
    textarea.style.height = `${newHeight}px`;
  }, [text]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    if (isModelDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModelDropdownOpen]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    if (value === undefined) {
      setInternalValue(newVal);
    }
    onChange?.(newVal);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList).filter((file) => {
      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      return acceptedFileTypes.includes(ext) || acceptedFileTypes.includes(file.type);
    });

    const updated = [...currentFiles, ...newFiles].slice(0, maxFiles);
    if (controlledFiles === undefined) {
      setInternalFiles(updated);
    }
    onFilesChange?.(updated);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updated = currentFiles.filter((_, idx) => idx !== indexToRemove);
    if (controlledFiles === undefined) {
      setInternalFiles(updated);
    }
    onFilesChange?.(updated);
  };

  const handleSelectModel = (modelId: string) => {
    if (controlledModel === undefined) {
      setInternalModel(modelId);
    }
    onModelChange?.(modelId);
    setIsModelDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (disabled || isLoading) return;
    const trimmed = text.trim();
    if (!trimmed && currentFiles.length === 0) return;

    onSubmit?.(trimmed, currentFiles, currentModel.id);

    if (value === undefined) {
      setInternalValue("");
    }
    if (controlledFiles === undefined) {
      setInternalFiles([]);
    }
  };

  const isSendDisabled = disabled || isLoading || (!text.trim() && currentFiles.length === 0);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition-all focus-within:border-neutral-400/80 focus-within:ring-2 focus-within:ring-neutral-200/50",
        isDragging && "border-[var(--accent)] ring-2 ring-[var(--accent-soft)]",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => {
            const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
            return acceptedFileTypes.includes(ext) || acceptedFileTypes.includes(file.type);
          });
          const updated = [...currentFiles, ...droppedFiles].slice(0, maxFiles);
          if (controlledFiles === undefined) {
            setInternalFiles(updated);
          }
          onFilesChange?.(updated);
        }
      }}
    >
      {/* Attached Files Badges */}
      {currentFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 px-1 pt-1">
          {currentFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="group inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--paper)] px-2.5 py-1 text-xs text-[var(--ink)]"
            >
              <FileText className="size-3.5 text-[var(--accent)]" />
              <span className="max-w-[160px] truncate font-medium">{file.name}</span>
              <span className="text-[10px] text-[var(--muted)]">({formatFileSize(file.size)})</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="ml-0.5 rounded p-0.5 text-[var(--muted)] hover:bg-neutral-200/60 hover:text-[var(--ink)]"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input / Textarea */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full resize-none bg-transparent px-2 pt-1 text-sm leading-relaxed text-[var(--ink)] placeholder:text-[var(--muted)]/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />

      {/* Bottom Action Toolbar */}
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-transparent pt-1">
        {/* Left: + File Upload Button */}
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes.join(",")}
            onChange={handleFileChange}
            className="hidden"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || currentFiles.length >= maxFiles}
            title="Attach file (.txt, .pdf)"
            aria-label="Attach file (.txt, .pdf)"
            className="flex size-7 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {/* Right: Model Selector & Send Button */}
        <div className="flex items-center gap-2">
          {/* Model Dropdown */}
          {models.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen((prev) => !prev)}
                disabled={disabled}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 cursor-pointer"
              >
                <span>{currentModel.name}</span>
                <ChevronDown className="size-3 opacity-70" />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute bottom-full right-0 z-50 mb-1.5 min-w-[200px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg text-[var(--ink)]">
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Select Model
                  </div>
                  {models.map((m) => {
                    const isSelected = m.id === currentModel.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModel(m.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer",
                          isSelected
                            ? "bg-black/[0.06] dark:bg-white/[0.08] font-medium text-[var(--ink)]"
                            : "text-[var(--muted)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] hover:text-[var(--ink)]"
                        )}
                      >
                        <div className="flex flex-col">
                          <span>{m.name}</span>
                          {m.provider && (
                            <span className="text-[10px] text-[var(--muted)]">
                              {m.provider}
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="size-3.5 text-[var(--ink)]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Submit / ArrowUp Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={isSendDisabled}
            aria-label="Send message"
            className="flex size-8 items-center justify-center rounded-lg bg-[#14151a] dark:bg-white dark:text-[#14151a] text-white shadow-xs transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
          >
            <ArrowUp className="size-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComposer;
