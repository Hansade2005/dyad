import React, { useEffect, useState } from "react";
import { useVercel } from "@/hooks/useVercel";
import { Button } from "@/components/ui/button";

export function VercelDomainManager({
  projectId,
  teamId,
}: {
  projectId: string;
  teamId?: string;
}) {
  const { listDomains, addDomain, removeDomain } = useVercel();
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listDomains(projectId, teamId);
      setDomains(res.domains || []);
    } catch (e: any) {
      setError(e.message || "Failed to load domains");
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
      await addDomain(projectId, { name: domain }, teamId);
      setDomain("");
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to add domain");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      await removeDomain(projectId, name, teamId);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to remove domain");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">Project Domains</div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-2 mb-2">
        <input
          className="border rounded px-2 py-1"
          placeholder="Domain (e.g. www.example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button onClick={handleAdd} disabled={loading || !domain}>
          Add
        </Button>
      </div>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <table className="w-full text-xs border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">Domain</th>
              <th className="px-2 py-1">Verified</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((dom) => (
              <tr key={dom.name}>
                <td className="px-2 py-1 font-mono">{dom.name}</td>
                <td className="px-2 py-1">{dom.verified ? "Yes" : "No"}</td>
                <td className="px-2 py-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(dom.name)}
                    disabled={loading}
                  >
                    Remove
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
