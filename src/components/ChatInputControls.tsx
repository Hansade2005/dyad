import { ContextFilesPicker } from "./ContextFilesPicker";
import { ModelPicker } from "./ModelPicker";
import { ProModeSelector } from "./ProModeSelector";
import { ChatModeSelector } from "./ChatModeSelector";
import { Globe } from "lucide-react";
import { useAtom } from "jotai";
import { webSearchAllowedAtom } from "@/atoms/chatAtoms";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ChatInputControls({
  showContextFilesPicker = false,
}: {
  showContextFilesPicker?: boolean;
}) {
  const [webSearchAllowed, setWebSearchAllowed] = useAtom(webSearchAllowedAtom);
  return (
    <div className="flex items-center">
      <ChatModeSelector />
      <div className="w-1.5"></div>
      <ModelPicker />
      <div className="w-1.5"></div>
      <ProModeSelector />
      <div className="w-1"></div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={webSearchAllowed ? "default" : "ghost"}
              size="sm"
              onClick={() => setWebSearchAllowed((v) => !v)}
              title="Allow AI to use web search for real-time info"
              className={webSearchAllowed ? "text-blue-600" : ""}
            >
              <Globe size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {webSearchAllowed
              ? "Web search enabled for this chat"
              : "Allow AI to use web search for real-time info"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
