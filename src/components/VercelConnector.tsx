import React, { useEffect, useState } from "react";
import { useVercel } from "@/hooks/useVercel";
import { Button } from "@/components/ui/button";
import { useLoadApp } from "@/hooks/useLoadApp";
import { IpcClient } from "@/ipc/ipc_client";
import { VercelEnvManager } from "./VercelEnvManager";
import { VercelDomainManager } from "./VercelDomainManager";

export function VercelConnector({ appId }: { appId: number }) {
  const {
    projects,
    loading,
    error,
    selectedProject,
    loadProjects,
    setAppProject,
    unsetAppProject,
    selectProject,
    deployProject,
    vercelApiKey,
    vercelApiKeySet,
    saveVercelApiKey,
  } = useVercel();
  const { app } = useLoadApp(appId);

  const [teamId, setTeamId] = useState("");
  const [deployStatus, setDeployStatus] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [commitInfo, setCommitInfo] = useState<{
    sha: string;
    message?: string;
  } | null>(null);
  const [commitLoading, setCommitLoading] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);
  const [lastDeploymentId, setLastDeploymentId] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<any>(null);
  const [deploymentLogs, setDeploymentLogs] = useState<any[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [vercelApiKeyInput, setVercelApiKeyInput] = useState("");
  const [vercelSaveStatus, setVercelSaveStatus] = useState<string | null>(null);

  // Show current key in masked form
  const maskedKey = vercelApiKeySet ? "••••••••••••••••" : "Not set";

  const { getDeploymentStatus, getDeploymentLogs } = useVercel();

  useEffect(() => {
    loadProjects(teamId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  useEffect(() => {
    async function fetchCommit() {
      if (!app?.githubOrg || !app?.githubRepo || !app?.githubBranch) {
        setCommitInfo(null);
        return;
      }
      setCommitLoading(true);
      setCommitError(null);
      try {
        const branches = await IpcClient.getInstance().getGithubRepoBranches(
          app.githubOrg,
          app.githubRepo,
        );
        const branch = branches.find((b: any) => b.name === app.githubBranch);
        if (branch) {
          setCommitInfo({ sha: branch.commit.sha });
        } else {
          setCommitInfo(null);
          setCommitError("Branch not found");
        }
      } catch (e: any) {
        setCommitError(e.message || "Failed to fetch commit info");
        setCommitInfo(null);
      } finally {
        setCommitLoading(false);
      }
    }
    fetchCommit();
  }, [app?.githubOrg, app?.githubRepo, app?.githubBranch]);

  // Poll deployment status if lastDeploymentId is set
  useEffect(() => {
    if (!lastDeploymentId) return;
    let interval: NodeJS.Timeout;
    let cancelled = false;
    async function poll() {
      if (!lastDeploymentId) return;
      try {
        const status = await getDeploymentStatus(
          lastDeploymentId as string,
          teamId,
        );
        setDeploymentStatus(status);
        if (
          status?.state &&
          ["READY", "ERROR", "CANCELED"].includes(status.state)
        ) {
          return;
        }
        // Fetch logs
        const logs = await getDeploymentLogs(
          lastDeploymentId as string,
          teamId,
        );
        setDeploymentLogs(logs?.events || []);
      } catch (e) {
        // Log error for debugging
        // eslint-disable-next-line no-console
        console.error("Error polling deployment status:", e);
      }
      if (!cancelled) {
        interval = setTimeout(poll, 4000);
      }
    }
    poll();
    return () => {
      cancelled = true;
      if (interval) clearTimeout(interval);
    };
  }, [lastDeploymentId, teamId]);

  const handleDeploy = async () => {
    if (!selectedProject) return;
    setDeploying(true);
    setDeployStatus(null);
    setDeploymentStatus(null);
    setDeploymentLogs([]);
    setLastDeploymentId(null);
    try {
      // Pass commit info as payload for Vercel deployment
      const result = await deployProject(selectedProject, teamId, {
        githubOrg: app?.githubOrg,
        githubRepo: app?.githubRepo,
        githubBranch: app?.githubBranch,
        commitSha: commitInfo?.sha,
      });
      setDeployStatus(
        "Deployment started: " + (result?.url || result?.id || "Success"),
      );
      if (result?.id) setLastDeploymentId(result.id);
    } catch (e: any) {
      setDeployStatus("Deployment failed: " + (e.message || "Unknown error"));
    } finally {
      setDeploying(false);
    }
  };

  const handleSaveKey = async () => {
    setVercelSaveStatus(null);
    try {
      await saveVercelApiKey(vercelApiKeyInput);
      setVercelSaveStatus("API key saved!");
      setVercelApiKeyInput("");
    } catch (e: any) {
      setVercelSaveStatus(e.message || "Failed to save API key");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Vercel Integration</h2>
      {/* Vercel Integration Guide Accordion */}
      <div className="mb-2">
        <button
          className="w-full text-left px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 border font-medium focus:outline-none focus:ring"
          onClick={() => setShowGuide((v) => !v)}
          aria-expanded={showGuide}
          aria-controls="vercel-guide-panel"
        >
          {showGuide ? "▼" : "▶"} How to connect Vercel?
        </button>
        {showGuide && (
          <div
            id="vercel-guide-panel"
            className="mt-2 px-4 py-3 bg-gray-50 border rounded text-sm space-y-2"
          >
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <b>Get your Vercel token:</b> <br />
                <a
                  href="https://vercel.com/account/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Create a Personal Access Token
                </a>{" "}
                on Vercel, then copy it.
              </li>
              <li>
                <b>Paste your token</b> into the Vercel Token field below and
                save.
              </li>
              <li>
                <b>(Optional) Enter Team ID</b> if using a Vercel team (find it
                in your Vercel Team Settings).
              </li>
              <li>
                <b>Select a project</b> from the dropdown and click{" "}
                <b>Associate</b>.
              </li>
              <li>
                <b>Connect a GitHub repo</b> to your app if not already
                connected.
              </li>
              <li>
                <b>Click Deploy</b> to trigger a deployment. Monitor status and
                logs below.
              </li>
              <li>
                <b>Manage Env Vars & Domains</b> using the managers at the
                bottom.
              </li>
            </ol>
          </div>
        )}
      </div>
      <div>
        <label className="block mb-1 font-medium">Vercel API Token:</label>
        {vercelApiKeySet ? (
          <div className="mb-1 text-green-700">
            API key is saved ({vercelApiKey ? `${"*".repeat(8)}...` : "masked"})
          </div>
        ) : (
          <div className="mb-1 text-gray-500">No API key set</div>
        )}
        <div>
          <label className="block font-medium">Current API Key:</label>
          <span className="font-mono select-all">{maskedKey}</span>
        </div>
        <div className="flex gap-2 items-end">
          <input
            type="password"
            className="border rounded px-2 py-1 w-full"
            value={vercelApiKeyInput}
            onChange={(e) => setVercelApiKeyInput(e.target.value)}
            placeholder="Paste your Vercel token here"
            disabled={loading}
          />
          <Button
            onClick={handleSaveKey}
            disabled={
              loading ||
              !vercelApiKeyInput ||
              vercelApiKeyInput === vercelApiKey
            }
          >
            Save
          </Button>
        </div>
        {vercelSaveStatus && (
          <div className="text-green-600">{vercelSaveStatus}</div>
        )}
      </div>
      <div>
        <label className="block mb-2">Team ID (optional):</label>
        <input
          className="border rounded px-2 py-1"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          placeholder="Enter teamId if using a team token"
        />
      </div>
      {error && <div className="text-red-500">{error.message}</div>}
      {loading && <div>Loading Vercel projects…</div>}
      <div>
        <label className="block mb-2">Select a Vercel project:</label>
        <select
          value={selectedProject || ""}
          onChange={(e) => selectProject(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">-- Select --</option>
          {projects.map((proj: any) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>
        <Button
          className="ml-2"
          disabled={!selectedProject || loading}
          onClick={() =>
            selectedProject && setAppProject(selectedProject, appId)
          }
        >
          Associate
        </Button>
        <Button
          className="ml-2"
          variant="destructive"
          disabled={loading}
          onClick={() => unsetAppProject(appId)}
        >
          Remove Association
        </Button>
        <Button
          className="ml-2"
          variant="secondary"
          disabled={!selectedProject || deploying}
          onClick={handleDeploy}
        >
          {deploying ? "Deploying..." : "Deploy"}
        </Button>
        {deployStatus && (
          <div
            className={
              deployStatus.startsWith("Deployment failed")
                ? "text-red-600"
                : "text-green-600"
            }
          >
            {deployStatus}
          </div>
        )}
      </div>
      {/* Connected GitHub repo/branch/commit info */}
      <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
        <div className="font-medium">Connected GitHub Repository:</div>
        {app?.githubOrg && app?.githubRepo ? (
          <>
            <div>
              <a
                href={`https://github.com/${app.githubOrg}/${app.githubRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {app.githubOrg}/{app.githubRepo}
              </a>
            </div>
            <div>
              Branch:{" "}
              <span className="font-mono">{app.githubBranch || "main"}</span>
            </div>
            <div>
              Latest Commit:{" "}
              {commitLoading ? (
                "Loading..."
              ) : commitInfo?.sha ? (
                <span className="font-mono">{commitInfo.sha.slice(0, 8)}</span>
              ) : commitError ? (
                <span className="text-red-500">{commitError}</span>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
          </>
        ) : (
          <div className="text-gray-500">
            No GitHub repository connected to this app.
          </div>
        )}
      </div>
      {/* Deployment Status/Logs */}
      {lastDeploymentId && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <div className="font-semibold mb-1">Deployment Status</div>
          <div>Status: {deploymentStatus?.state || "Loading..."}</div>
          {deploymentStatus?.url && (
            <div>
              <a
                href={deploymentStatus.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Deployment
              </a>
            </div>
          )}
          <div className="mt-2 font-semibold">Logs:</div>
          <div className="max-h-40 overflow-y-auto text-xs bg-black text-white p-2 rounded">
            {deploymentLogs.length === 0 ? (
              <div>No logs yet.</div>
            ) : (
              deploymentLogs.map((log, i) => (
                <div key={i}>
                  [{log.type}] {log.text}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Env Vars & Domains Management */}
      {selectedProject && (
        <>
          <VercelEnvManager
            projectId={selectedProject}
            teamId={teamId || undefined}
          />
          <VercelDomainManager
            projectId={selectedProject}
            teamId={teamId || undefined}
          />
        </>
      )}
    </div>
  );
}
