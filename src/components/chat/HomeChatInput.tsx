import { SendIcon, StopCircleIcon, Globe, Paperclip } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { useSettings } from "@/hooks/useSettings";
import { homeChatInputValueAtom } from "@/atoms/chatAtoms"; // Use a different atom for home input
import { useAtom } from "jotai";
import { useStreamChat } from "@/hooks/useStreamChat";
import { useAttachments } from "@/hooks/useAttachments";
import { AttachmentsList } from "./AttachmentsList";
import { DragDropOverlay } from "./DragDropOverlay";
import { usePostHog } from "posthog-js/react";
import { HomeSubmitOptions } from "@/pages/home";
import { ChatInputControls } from "../ChatInputControls";
export function HomeChatInput({
  onSubmit,
}: {
  onSubmit: (options?: HomeSubmitOptions) => void;
}) {
  const posthog = usePostHog();
  const [inputValue, setInputValue] = useAtom(homeChatInputValueAtom);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { settings } = useSettings();
  const { isStreaming } = useStreamChat({
    hasChatId: false,
  }); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [websearchActive, setWebsearchActive] = useState(false);

  // Use the attachments hook
  const {
    attachments,
    fileInputRef,
    isDraggingOver,
    handleAttachmentClick,
    handleFileChange,
    removeAttachment,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearAttachments,
    handlePaste,
  } = useAttachments();

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight + 4}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [inputValue]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomSubmit();
    }
  };

  // Custom submit function that wraps the provided onSubmit
  const handleCustomSubmit = () => {
    if ((!inputValue.trim() && attachments.length === 0) || isStreaming) {
      return;
    }
    let finalInput = inputValue;
    if (websearchActive) {
      finalInput =
        "[Websearch is available. Use /websearch <query> to fetch real-time data.]\n" +
        inputValue;
    }
    // Call the parent's onSubmit handler with attachments and modified input
    onSubmit({ attachments, inputValue: finalInput });

    // Clear attachments as part of submission process
    clearAttachments();
    posthog.capture("chat:home_submit");
  };

  if (!settings) {
    return null; // Or loading state
  }

  return (
    <>
      <div className="p-4" data-testid="home-chat-input-container">
        <div
          className={`relative flex flex-col space-y-2 border border-border rounded-2xl bg-white/60 dark:bg-gray-900/60 shadow-lg backdrop-blur-md transition-all duration-200 ${
            isDraggingOver ? "ring-2 ring-blue-500 border-blue-500" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Attachments list */}
          <AttachmentsList
            attachments={attachments}
            onRemove={removeAttachment}
          />

          {/* Drag and drop overlay */}
          <DragDropOverlay isDraggingOver={isDraggingOver} />

          <div className="flex items-start gap-3 px-3 pt-2">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              placeholder="Ask Trio to build..."
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner min-h-[44px] max-h-[200px] text-base transition-all duration-200 resize-none"
              style={{ resize: "none" }}
              disabled={isStreaming}
            />
            {/* Globe icon for websearch */}
            <button
              type="button"
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none mr-1 ${websearchActive ? "bg-blue-100 dark:bg-blue-900" : ""}`}
              title="Websearch"
              aria-label="Websearch"
              tabIndex={0}
              onClick={() => setWebsearchActive((v) => !v)}
            >
              <Globe
                className={`w-5 h-5 ${websearchActive ? "text-blue-600" : "text-gray-500"}`}
              />
            </button>
            {/* File attachment button */}
            <button
              onClick={handleAttachmentClick}
              className="flex items-center justify-center w-10 h-10 mt-1 mr-1 rounded-full bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 shadow hover:bg-primary/10 transition disabled:opacity-50"
              disabled={isStreaming}
              title="Attach files"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.webp,.txt,.md,.js,.ts,.html,.css,.json,.csv"
            />

            {isStreaming ? (
              <button
                className="flex items-center justify-center w-10 h-10 mt-1 mr-2 rounded-full bg-gray-200 dark:bg-gray-800 text-(--sidebar-accent-fg) opacity-50 cursor-not-allowed"
                title="Cancel generation (unavailable here)"
              >
                <StopCircleIcon size={20} />
              </button>
            ) : (
              <button
                onClick={handleCustomSubmit}
                disabled={!inputValue.trim() && attachments.length === 0}
                className="flex items-center justify-center w-10 h-10 mt-1 mr-2 rounded-full bg-primary/90 text-white shadow hover:bg-primary transition disabled:opacity-50"
                title="Send message"
              >
                <SendIcon size={20} />
              </button>
            )}
          </div>
          <div className="px-2 pb-2">
            <ChatInputControls />
          </div>
        </div>
      </div>
    </>
  );
}
