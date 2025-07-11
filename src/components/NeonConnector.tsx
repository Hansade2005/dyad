import React, { useEffect, useState } from "react";
import { useNeon } from "@/hooks/useNeon";
import { Button } from "@/components/ui/button";

export function NeonConnector() {
  const {
    apiKey,
    apiKeySet,
    saveApiKey,
    projects,
    loadProjects,
    createProject,
    deleteProject,
    selectedProject,
    selectProject,
    runSql,
    loading,
    error,
  } = useNeon();

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [sql, setSql] = useState("");
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Show current key in masked form
  const maskedKey = apiKeySet ? "••••••••••••••••" : "Not set";

  useEffect(() => {
    if (apiKey) loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) setApiKeyInput("");
  }, [apiKey]);

  const handleSaveApiKey = async () => {
    setSaveStatus(null);
    try {
      await saveApiKey(apiKeyInput);
      setSaveStatus("API key saved!");
      setApiKeyInput("");
    } catch (e: any) {
      setSaveStatus(e.message || "Failed to save API key");
    }
  };

  const handleCreateProject = async () => {
    await createProject();
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Delete this Neon project?")) {
      await deleteProject(projectId);
    }
  };

  const handleRunSql = async () => {
    setSqlError(null);
    setSqlResult(null);
    if (!selectedProject) return;
    try {
      const result = await runSql(selectedProject, sql);
      setSqlResult(result);
    } catch (e: any) {
      setSqlError(e.message || "SQL error");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Neon Integration</h2>
      {/* Neon Integration Guide Accordion */}
      <div className="mb-2">
        <button
          className="w-full text-left px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 border font-medium focus:outline-none focus:ring"
          onClick={() => setShowGuide((v) => !v)}
          aria-expanded={showGuide}
          aria-controls="neon-guide-panel"
        >
          {showGuide ? "▼" : "▶"} How to connect Neon?
        </button>
        {showGuide && (
          <div
            id="neon-guide-panel"
            className="mt-2 px-4 py-3 bg-gray-50 border rounded text-sm space-y-2"
          >
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <b>Get your Neon API key:</b> <br />
                <a
                  href="https://console.neon.tech/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Create a Neon API Key
                </a>{" "}
                on Neon, then copy it.
              </li>
              <li>
                <b>Paste your API key</b> into the Neon API Key field below and
                save.
              </li>
              <li>
                <b>Create a project</b> or select an existing one from the
                dropdown.
              </li>
              <li>
                <b>Run SQL queries</b> on your selected project using the SQL
                runner.
              </li>
              <li>
                <b>Delete projects</b> when no longer needed.
              </li>
            </ol>
          </div>
        )}
      </div>
      {/* API Key Input */}
      <div>
        <label className="block mb-1 font-medium">Current API Key:</label>
        <span className="font-mono select-all">{maskedKey}</span>
      </div>
      <div className="flex gap-2 items-end">
        <input
          type="password"
          className="border rounded px-2 py-1 w-full"
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          placeholder="Paste your Neon API key here"
          disabled={loading}
        />
        <Button
          onClick={handleSaveApiKey}
          disabled={loading || !apiKeyInput || apiKeyInput === apiKey}
        >
          Save
        </Button>
      </div>
      {saveStatus && <div className="text-green-600">{saveStatus}</div>}
      {/* Project Management */}
      <div>
        <div className="flex items-center mb-2">
          <Button onClick={handleCreateProject} disabled={loading || !apiKey}>
            Create Neon Project
          </Button>
        </div>
        <div>
          <label className="block mb-1">Select Project:</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedProject || ""}
            onChange={(e) => selectProject(e.target.value)}
            disabled={loading || projects.length === 0}
          >
            <option value="">-- Select --</option>
            {projects.map((proj: any) => (
              <option key={proj.project.id} value={proj.project.id}>
                {proj.project.name || proj.project.id}
              </option>
            ))}
          </select>
          {selectedProject && (
            <Button
              className="ml-2"
              variant="destructive"
              onClick={() => handleDeleteProject(selectedProject)}
              disabled={loading}
            >
              Delete Project
            </Button>
          )}
        </div>
      </div>
      {/* SQL Runner */}
      <div>
        <label className="block mb-1 font-medium">
          Run SQL on Selected Project:
        </label>
        <textarea
          className="border rounded px-2 py-1 w-full min-h-[60px] font-mono"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Write SQL query here..."
        />
        <Button
          className="mt-2"
          onClick={handleRunSql}
          disabled={loading || !selectedProject || !sql}
        >
          Run SQL
        </Button>
        {sqlError && <div className="text-red-600 mt-1">{sqlError}</div>}
        {sqlResult && (
          <pre className="mt-2 bg-gray-100 rounded p-2 text-xs overflow-x-auto">
            {JSON.stringify(sqlResult, null, 2)}
          </pre>
        )}
      </div>
      {/* Feedback */}
      {error && <div className="text-red-600">{error}</div>}
      {loading && <div>Loading…</div>}
    </div>
  );
}
