import { ipcMain } from "electron";

ipcMain.handle("websearch", async (_event, { query }: { query: string }) => {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("Tavily API key not set");
  if (!query || typeof query !== "string") throw new Error("Query must be a string");
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Web search failed: ${response.status} ${text}`);
    }
    const results = await response.json();
    return { results };
  } catch (err: any) {
    throw new Error("Web search error: " + (err?.message || err));
  }
}); 