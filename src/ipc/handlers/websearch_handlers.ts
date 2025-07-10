import { ipcMain } from "electron";
import {
  googleCseSearch,
  playwrightWebSearch,
  websearchWithSnippets,
} from "../utils/websearch";
import { readSettings } from "../../main/settings";

ipcMain.handle("websearch:google-cse", async (_event, { query, num }) => {
  const settings = readSettings();
  const cx = settings.websearch?.googleCseCx;
  const apiKey = settings.websearch?.googleCseApiKey;
  if (!cx || !apiKey)
    throw new Error("Google CSE cx/apiKey not set in settings");
  return googleCseSearch({ query, cx, apiKey, num });
});

ipcMain.handle("websearch:playwright", async (_event, { url, selector }) => {
  return playwrightWebSearch({ url, selector });
});

ipcMain.handle("websearch:with-snippets", async (_event, { query, num }) => {
  const settings = readSettings();
  const cx = settings.websearch?.googleCseCx;
  const apiKey = settings.websearch?.googleCseApiKey;
  if (!cx || !apiKey)
    throw new Error("Google CSE cx/apiKey not set in settings");
  return websearchWithSnippets({ query, cx, apiKey, num });
});
