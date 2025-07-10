# Websearch Tool (Google CSE + Playwright)

## Overview

This tool allows you to perform targeted web searches using Google Custom Search Engine (CSE) and scrape dynamic content using Playwright. You can configure your own CSE `cx` and API key in the settings.

## Configuration

1. Go to **Settings → Websearch** in the app.
2. Enter your Google CSE `cx` and API key.
   - [Create a CSE](https://programmablesearchengine.google.com/about/)
   - [Get an API key](https://console.developers.google.com/apis/credentials)
3. Save your settings.

## Usage

### Google CSE

- **Prompt format:**
  ```
  /websearch <query>
  ```
  Example:
  ```
  /websearch latest TypeScript features
  ```
- **Returns:** Top URLs and snippets from Google CSE.

### Playwright (Dynamic Scraping)

- **Prompt format:**
  ```
  /webscrape <url> <css selector>
  ```
  Example:
  ```
  /webscrape https://news.ycombinator.com .storylink
  ```
- **Returns:** Text content of the selector from the page.

## API

- IPC: `websearch:google-cse` and `websearch:playwright`
- See `src/ipc/utils/websearch.ts` for backend details.

## Notes

- You can change your CSE keys at any time in settings.
- Playwright scraping requires the app to have network access and may be slower for large pages.

---

# Websearch Tool Usage

## Overview

The websearch tool lets you fetch real-time information from the internet using Google Custom Search and Playwright-powered scraping. It returns structured, AI-ready results with titles, links, sources, and relevant sentences from the top results.

---

## How to Configure

1. **Get your Google CSE API Key and cx:**
   - [Create a Google Custom Search Engine](https://cse.google.com/cse/all)
   - [Get an API key](https://developers.google.com/custom-search/v1/overview)
2. **Set your keys in the app:**
   - Go to **Settings → Websearch**
   - Enter your `cx` and `API Key` and save.

---

## How to Use

### Command Format

- **Prompt:**

  ```
  /websearch <your query>
  ```

  Example:

  ```
  /websearch CSS flexbox layout guide
  ```

- **What happens:**

  1. The tool calls Google Custom Search for the top 8 results.
  2. It visits each result, extracts relevant sentences, and returns a structured JSON like:

  ```json
  {
    "results": [
      {
        "document_id": 0,
        "title": "CSS Flexbox Layout Guide | CSS-Tricks",
        "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
        "source": "CSS Tricks",
        "sentences": [
          "Flexbox is what CSS has been sorely lacking since its inception – an easy way to create flexible web page layouts without the need for floats, clears, margin: 0 auto and JS hacks.",
          "I look forward to the day when flexbox is supported by a big enough share of the browser market to put into this all of our production sites."
        ]
      },
      ...
    ]
  }
  ```

---

## Advanced

- You can use the Playwright tool directly for scraping any page:
  ```
  /playwright <url> [selector]
  ```
  Example:
  ```
  /playwright https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox
  ```

---

## Troubleshooting

- Make sure your API key and cx are valid and have quota.
- Some sites may block scraping or require login.

---

## Security

- Your API keys are stored locally and only used for your searches.
