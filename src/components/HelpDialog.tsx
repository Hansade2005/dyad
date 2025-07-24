import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BookOpenIcon,
  BugIcon,
  UploadIcon,
  ChevronLeftIcon,
  CheckIcon,
  XIcon,
  FileIcon,
} from "lucide-react";
import { IpcClient } from "@/ipc/ipc_client";
import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { selectedChatIdAtom } from "@/atoms/chatAtoms";
import { ChatLogsData } from "@/ipc/ipc_types";
import { showError } from "@/lib/toast";

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [chatLogsData, setChatLogsData] = useState<ChatLogsData | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const selectedChatId = useAtomValue(selectedChatIdAtom);

  // For GitHub API
  const GITHUB_API_URL = "https://api.github.com/repos/Hansade2005/dyad/issues";

  // Function to reset all dialog state
  const resetDialogState = () => {
    setIsLoading(false);
    setIsUploading(false);
    setReviewMode(false);
    setChatLogsData(null);
    setUploadComplete(false);
    setSessionId("");
  };

  // Reset state when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      resetDialogState();
    }
  }, [isOpen]);

  // Helper to create a GitHub issue via API
  async function createGithubIssue({ title, body }: { title: string; body: string }) {
    try {
      const response = await fetch(GITHUB_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you need a GitHub token for higher rate limits, uncomment and provide it:
          // Authorization: `token YOUR_GITHUB_TOKEN`,
        },
        body: JSON.stringify({
          title,
          body,
          labels: ["bug", "filed-from-app"],
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error creating GitHub issue:", error);
      showError("Failed to create GitHub issue. Please try again or create manually.");
      throw error; // Re-throw to be caught by the calling function
    }
  }

  const handleClose = () => {
    resetDialogState();
    onClose();
  };

  const handleCancelReview = () => {
    setReviewMode(false);
    setChatLogsData(null);
  };

  const handleReportBug = async () => {
    setIsLoading(true);
    try {
      const debugInfo = await IpcClient.getInstance().getSystemDebugInfo();
      const issueBody = `
## Bug Report from Trio AI App

**Trio App Version:** ${debugInfo.dyadVersion}
**Platform:** ${debugInfo.platform}
**Architecture:** ${debugInfo.architecture}
**Node Version:** ${debugInfo.nodeVersion || "Not available"}

---

### Description
### Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior
### Actual Behavior
### Logs
\`\`\`
${debugInfo.logs}
\`\`\`
`;

      const issue = await createGithubIssue({
        title: "[bug] <add concise bug title here>",
        body: issueBody,
      });
      window.open(issue.html_url, "_blank");
    } catch (error) {
      console.error("Failed to prepare bug report:", error);
      showError("Failed to create bug report. Opening general GitHub issue page.");
      IpcClient.getInstance().openExternalUrl(
        "https://github.com/Hansade2005/dyad/issues/new",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadChatSession = async () => {
    if (!selectedChatId) {
      showError("No chat selected to upload.");
      return;
    }
    setIsUploading(true);
    try {
      const chatLogs = await IpcClient.getInstance().getChatLogs(selectedChatId);
      setChatLogsData(chatLogs);
      setReviewMode(true);
    } catch (error) {
      console.error("Failed to retrieve chat session for upload:", error);
      showError("Failed to prepare chat session for upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitChatLogs = async () => {
    if (!chatLogsData) {
      showError("No chat logs data to submit.");
      return;
    }

    setIsUploading(true);
    try {
      const chatLogsMarkdown = `
## Chat Session Logs

### System Information
- Trio App Version: ${chatLogsData.debugInfo.dyadVersion}
- Platform: ${chatLogsData.debugInfo.platform}
- Architecture: ${chatLogsData.debugInfo.architecture}
- Node Version: ${chatLogsData.debugInfo.nodeVersion || "Not available"}

### Chat Messages
\`\`\`json
${JSON.stringify(chatLogsData.chat.messages, null, 2)}
\`\`\`

### Codebase Snippet
\`\`\`
${chatLogsData.codebase}
\`\`\`

### Logs (System & App)
\`\`\`
${chatLogsData.debugInfo.logs}
\`\`\`
`;

      const issue = await createGithubIssue({
        title: `[chat session upload] ${chatLogsData.chat.title || "Untitled Chat"} - ${new Date().toLocaleString()}`,
        body: chatLogsMarkdown,
      });

      setSessionId(issue.number.toString());
      setUploadComplete(true);
      setReviewMode(false);
      window.open(issue.html_url, "_blank");
    } catch (error) {
      console.error("Failed to upload chat logs to GitHub:", error);
      showError("Failed to upload chat logs. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenGitHubIssue = () => {
    const issueBody = `
## Support Request
**Session ID:** ${sessionId}

---

## Issue Description
## Expected Behavior
## Actual Behavior
`;

    const encodedBody = encodeURIComponent(issueBody);
    const encodedTitle = encodeURIComponent(`[session report] Issue for Session ID: ${sessionId}`);
    const githubIssueUrl = `https://github.com/Hansade2005/dyad/issues/new?title=${encodedTitle}&labels=support&body=${encodedBody}`;

    IpcClient.getInstance().openExternalUrl(githubIssueUrl);
    handleClose();
  };

  if (uploadComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Complete</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-full">
              <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium">
              Chat Logs Uploaded Successfully
            </h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded flex items-center space-x-2 font-mono text-sm">
              <FileIcon
                className="h-4 w-4 cursor-pointer"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(sessionId);
                    showError("Session ID copied!"); // Consider a success toast
                  } catch (err) {
                    console.error("Failed to copy session ID:", err);
                    showError("Failed to copy session ID.");
                  }
                }}
              />
              <span>{sessionId}</span>
            </div>
            <p className="text-center text-sm">
              Please open a GitHub issue so we can follow-up with you on this
              issue. The session ID above is crucial for us to link your report to the uploaded data.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleOpenGitHubIssue} className="w-full">
              Open GitHub Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (reviewMode && chatLogsData) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Button
                variant="ghost"
                className="mr-2 p-0 h-8 w-8"
                onClick={handleCancelReview}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              OK to upload chat session?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please review the information that will be submitted. Your chat
            messages, system information, and a snapshot of your codebase will
            be included.
          </DialogDescription>

          <div className="space-y-4 overflow-y-auto flex-grow">
            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-2">Chat Messages</h3>
              <div className="text-sm bg-slate-50 dark:bg-slate-900 rounded p-2 max-h-40 overflow-y-auto">
                {chatLogsData.chat.messages.map((msg) => (
                  <div key={msg.id} className="mb-2">
                    <span className="font-semibold">
                      {msg.role === "user" ? "You" : "Assistant"}:{" "}
                    </span>
                    <span>{msg.content}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-2">Codebase Snapshot</h3>
              <div className="text-sm bg-slate-50 dark:bg-slate-900 rounded p-2 max-h-40 overflow-y-auto font-mono">
                {chatLogsData.codebase || "No codebase snapshot available."}
              </div>
            </div>

            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-2">Logs</h3>
              <div className="text-sm bg-slate-50 dark:bg-slate-900 rounded p-2 max-h-40 overflow-y-auto font-mono">
                {chatLogsData.debugInfo.logs || "No logs available."}
              </div>
            </div>

            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-2">System Information</h3>
              <div className="text-sm bg-slate-50 dark:bg-slate-900 rounded p-2 max-h-32 overflow-y-auto">
                <p>Trio App Version: {chatLogsData.debugInfo.dyadVersion}</p>
                <p>Platform: {chatLogsData.debugInfo.platform}</p>
                <p>Architecture: {chatLogsData.debugInfo.architecture}</p>
                <p>
                  Node Version:{" "}
                  {chatLogsData.debugInfo.nodeVersion || "Not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4 pt-2 sticky bottom-0 bg-background">
            <Button
              variant="outline"
              onClick={handleCancelReview}
              className="flex items-center"
            >
              <XIcon className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button
              onClick={handleSubmitChatLogs}
              className="flex items-center"
              disabled={isUploading}
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" /> Upload
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Need help with Trio AI ?</DialogTitle>
        </DialogHeader>
        <DialogDescription className="">
          If you need help or want to report an issue, here are some options:
        </DialogDescription>
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                IpcClient.getInstance().openExternalUrl(
                  "https://optimaai.cc/trio/docs",
                );
              }}
              className="w-full py-6 bg-(--background-lightest)"
            >
              <BookOpenIcon className="mr-2 h-5 w-5" /> Open Docs
            </Button>
            <p className="text-sm text-muted-foreground px-2">
              Get help with common questions and issues.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={handleReportBug}
              disabled={isLoading}
              className="w-full py-6 bg-(--background-lightest)"
            >
              <BugIcon className="mr-2 h-5 w-5" />{" "}
              {isLoading ? "Preparing Report..." : "Report a Bug"}
            </Button>
            <p className="text-sm text-muted-foreground px-2">
              We'll auto-fill your report with system info and logs. You can
              review it for any sensitive info before submitting.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={handleUploadChatSession}
              disabled={isUploading || !selectedChatId}
              className="w-full py-6 bg-(--background-lightest)"
            >
              <UploadIcon className="mr-2 h-5 w-5" />{" "}
              {isUploading ? "Preparing Upload..." : "Upload Chat Session"}
            </Button>
            <p className="text-sm text-muted-foreground px-2">
              Share chat logs and code for troubleshooting. Data is used only to
              resolve your issue and auto-deleted after a limited time.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}