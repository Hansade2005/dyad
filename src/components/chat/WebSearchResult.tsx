import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Globe, ChevronDown, ChevronUp } from "lucide-react";

export function WebSearchResult({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-blue-200 bg-blue-50 dark:bg-blue-950 rounded-lg my-2">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-left focus:outline-none hover:bg-blue-100 dark:hover:bg-blue-900 rounded-t-lg"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        type="button"
      >
        <Globe className="text-blue-500" size={18} />
        <span className="font-medium text-blue-900 dark:text-blue-100 flex-1">Web Search Result</span>
        {expanded ? (
          <ChevronUp className="text-blue-400" size={18} />
        ) : (
          <ChevronDown className="text-blue-400" size={18} />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-3 pt-1 text-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
} 