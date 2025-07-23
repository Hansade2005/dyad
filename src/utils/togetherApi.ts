import fetch from 'node-fetch';

const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || 'c0c4d20f02dc71fdc2526f83049d0ed742b9cecbd1973abfe88610f6d0e9be2f';
const MODEL = 'lgai/exaone-3-5-32b-instruct';

export interface TogetherChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function togetherChatCompletion(messages: TogetherChatMessage[]): Promise<string> {
  const res = await fetch(TOGETHER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    throw new Error(`Together API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
