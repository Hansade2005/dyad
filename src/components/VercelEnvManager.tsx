import React, { useEffect, useState } from "react";
import { useVercel } from "@/hooks/useVercel";
import { Button } from "@/components/ui/button";

export function VercelEnvManager({
  projectId,
  teamId,
}: {
  projectId: string;
  teamId?: string;
}) {
  const { listEnvs, addEnv, deleteEnv } = useVercel();
  const [envs, setEnvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [target, setTarget] = useState("production");
  const [type, setType] = useState("encrypted");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listEnvs(projectId, teamId);
      setEnvs(res.envs || []);
    } catch (e: any) {
      setError(e.message || "Failed to load envs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId, teamId]);

  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      await addEnv(
        projectId,
        {
          key,
          value,
          target: [target],
          type,
        },
        teamId,
      );
      setKey("");
      setValue("");
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to add env");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (envId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEnv(projectId, envId, teamId);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to delete env");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">Environment Variables</div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-2 mb-2">
        <input
          className="border rounded px-2 py-1"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="production">production</option>
          <option value="preview">preview</option>
          <option value="development">development</option>
        </select>
        <select
          className="border rounded px-2 py-1"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="encrypted">encrypted</option>
          <option value="plain">plain</option>
        </select>
        <Button onClick={handleAdd} disabled={loading || !key || !value}>
          Add
        </Button>
      </div>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <table className="w-full text-xs border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">Key</th>
              <th className="px-2 py-1">Value</th>
              <th className="px-2 py-1">Target</th>
              <th className="px-2 py-1">Type</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {envs.map((env) => (
              <tr key={env.id}>
                <td className="px-2 py-1 font-mono">{env.key}</td>
                <td className="px-2 py-1 font-mono">
                  {env.value || <span className="text-gray-400">(hidden)</span>}
                </td>
                <td className="px-2 py-1">{env.target?.join(", ")}</td>
                <td className="px-2 py-1">{env.type}</td>
                <td className="px-2 py-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(env.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
