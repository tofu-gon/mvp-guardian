import { submitPostRequest } from '../apiclient';
import { summaryPrompt } from './prompthelper';

export async function openaiSummary(newsTitle: string[], tweets: string[]): Promise<string> {
  const url = 'https://api.openai.com/v1/completions'

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }

  const body = {
    model: 'gpt-3.5-turbo-instruct', // 使用するモデルを選択
    prompt: summaryPrompt(newsTitle, tweets),
    max_tokens: 150,
    temperature: 0.7,
  }

  const response = await submitPostRequest(url, headers, body)
  console.log(response.jsonBody)

  return response.jsonBody.choices[0].text
}



function authToken(): string {
  if(!process.env.OPEN_AI_API_KEY) {
    throw new Error('OPEN_AI_API_KEY is not defined in environment variables');
  }
  return process.env.OPEN_AI_API_KEY
}