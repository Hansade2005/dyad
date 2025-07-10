import { ContextFilesPicker } from "./ContextFilesPicker";
import { ModelPicker } from "./ModelPicker";
import { ProModeSelector } from "./ProModeSelector";
import { ChatModeSelector } from "./ChatModeSelector";
import { Globe } from "lucide-react";
import { useState } from "react";

export function ChatInputControls({
  showContextFilesPicker = false,
  onWebsearchToggle,
  websearchActive: websearchActiveProp,
}: {
  showContextFilesPicker?: boolean;
  onWebsearchToggle?: (active: boolean) => void;
  websearchActive?: boolean;
}) {
  const [websearchActive, setWebsearchActive] = useState(false);
  const isActive =
    websearchActiveProp !== undefined ? websearchActiveProp : websearchActive;
  const handleToggle = () => {
    const next = !isActive;
    setWebsearchActive(next);
    if (onWebsearchToggle) onWebsearchToggle(next);
  };
  return (
    <div className="flex items-center">
      {/* Globe icon for websearch */}
      <button
        type="button"
        className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none mr-1 ${
          isActive ? "bg-blue-100 dark:bg-blue-900" : ""
        }`}
        title="Websearch"
        aria-label="Websearch"
        tabIndex={0}
        onClick={handleToggle}
      >
        <Globe
          className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`}
        />
      </button>
      <ChatModeSelector />
      <div className="w-1.5"></div>
      <ModelPicker />
      <div className="w-1.5"></div>
      <ProModeSelector />
      <div className="w-1"></div>
      {showContextFilesPicker && (
        <>
          <ContextFilesPicker />
          <div className="w-0.5"></div>
        </>
      )}
    </div>
  );
}
