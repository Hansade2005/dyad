// utils/websearch.ts
import fetch from "node-fetch";

export async function performWebSearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "Web search error: Tavily API key not set.";
  if (!query || typeof query !== "string") return "Web search error: Query must be a string.";
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
      return `Web search failed: ${response.status} ${text}`;
    }
    const results = await response.json();
    if (!results || !Array.isArray(results.results)) {
      return "No web search results found.";
    }
    const topResults = results.results.slice(0, 3);
    let content = "**Top Web Results:**\n";
    for (const r of topResults) {
      content += `- [${r.title || r.url}](${r.url})\n`;
      if (r.snippet) content += `  > ${r.snippet}\n`;
    }
    return content;
  } catch (err: any) {
    return `Web search error: ${err?.message || err}`;
  }
}
