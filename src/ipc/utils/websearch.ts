import fetch from "node-fetch";
import { chromium } from "playwright";

export interface GoogleCseResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export interface WebsearchDocument {
  document_id: number;
  title: string;
  url: string;
  source: string;
  sentences: string[];
}

export interface WebsearchResults {
  results: WebsearchDocument[];
}

export async function googleCseSearch({
  query,
  cx,
  apiKey,
  num = 8,
}: {
  query: string;
  cx: string;
  apiKey: string;
  num?: number;
}): Promise<GoogleCseResult[]> {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${cx}&key=${apiKey}&num=${num}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google CSE error: ${res.statusText}`);
  const data = await res.json();
  if (!data.items) return [];
  return data.items.slice(0, num).map((item: any) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    displayLink: item.displayLink || new URL(item.link).hostname,
  }));
}

export async function playwrightWebSearch({
  url,
  selector,
}: {
  url: string;
  selector?: string;
}): Promise<string[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
  let textContent: string[] = [];
  if (selector) {
    const elements = await page.$$(selector);
    textContent = await Promise.all(
      elements.map(async (el) => (await el.textContent()) || ""),
    );
  } else {
    // fallback: get all visible text
    textContent = [(await page.textContent("body")) || ""];
  }
  await browser.close();
  return textContent
    .filter(Boolean)
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function websearchWithSnippets({
  query,
  cx,
  apiKey,
  num = 8,
}: {
  query: string;
  cx: string;
  apiKey: string;
  num?: number;
}): Promise<WebsearchResults> {
  // Step 1: Google CSE
  const cseResults = await googleCseSearch({ query, cx, apiKey, num });
  // Step 2: For each top result, scrape with Playwright
  const docs: WebsearchDocument[] = [];
  for (let i = 0; i < cseResults.length; i++) {
    const { title, link, snippet, displayLink } = cseResults[i];
    let sentences: string[] = [];
    try {
      // Try to extract main content (fallback to snippet)
      const pageText = await playwrightWebSearch({ url: link });
      // Split into sentences, filter short ones
      sentences = pageText
        .join(" ")
        .split(/[.!?\n]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 40)
        .slice(0, 8);
      if (sentences.length === 0 && snippet) sentences = [snippet];
    } catch {
      // fallback to snippet only
      if (snippet) sentences = [snippet];
    }
    docs.push({
      document_id: i,
      title,
      url: link,
      source: displayLink,
      sentences,
    });
  }
  return { results: docs };
}
