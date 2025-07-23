import { ipcMain } from "electron";
import { performWebSearch } from "../../utils/websearch";

ipcMain.handle("websearch", async (_event, { query }: { query: string }) => {
  const markdown = await performWebSearch(query);
  return { markdown };
});