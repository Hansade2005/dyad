import React, { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function WebsearchSettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [cx, setCx] = useState(settings?.websearch?.googleCseCx || "");
  const [apiKey, setApiKey] = useState(
    settings?.websearch?.googleCseApiKey || "",
  );
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = async () => {
    await updateSettings({
      websearch: {
        googleCseCx: cx,
        googleCseApiKey: apiKey,
      },
    });
    setStatus("Saved!");
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Websearch Settings</h2>
      <div>
        <label className="block mb-1 font-medium">Google CSE cx</label>
        <Input
          value={cx}
          onChange={(e) => setCx(e.target.value)}
          placeholder="Custom Search Engine cx"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Google CSE API Key</label>
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Google API Key"
        />
      </div>
      <Button onClick={handleSave}>Save</Button>
      {status && <div className="text-green-600">{status}</div>}
    </div>
  );
}
