import { useSettings } from "@/hooks/useSettings";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { IpcClient } from "@/ipc/ipc_client";

export function AutoUpdateSwitch() {
  const { settings, updateSettings } = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="enable-auto-update"
        checked={settings.enableAutoUpdate}
        onCheckedChange={(checked) => {
          updateSettings({ enableAutoUpdate: checked });
          toast("Auto-update settings changed", {
            description:
              "You will need to restart Trio for your settings to take effect.",
            action: {
              label: "Restart Trio",
              onClick: () => {
                IpcClient.getInstance().restartDyad();
              },
            },
          });
        }}
      />
      <Label htmlFor="enable-auto-update">Auto-update</Label>
    </div>
  );
}
