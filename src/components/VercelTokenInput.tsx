import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export function VercelTokenInput({
  onTokenSaved,
}: {
  onTokenSaved?: () => void;
}) {
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveToken = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // @ts-ignore
      await window.electron.ipcRenderer.invoke("vercel:set-token", { token });
      setSuccess(true);
      setToken("");
      onTokenSaved?.();
    } catch (e: any) {
      setError(e.message || "Failed to save token");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Vercel Access Token</label>
      <input
        type="password"
        className="border rounded px-2 py-1 w-full"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste your Vercel token here"
        disabled={saving}
      />
      <Button onClick={saveToken} disabled={!token || saving}>
        {saving ? "Saving..." : "Save Token"}
      </Button>
      {success && <div className="text-green-600">Token saved!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
