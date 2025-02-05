import { submitPostRequest } from '../apiclient';

export async function openaiSummary(prompt: string): Promise<string> {
  const url = 'https://api.openai.com/v1/completions'

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }

  const body = {
    model: 'gpt-3.5-turbo-instruct', // 使用するモデルを選択
    prompt: prompt,
    max_tokens: 150,
    temperature: 0.7,
  }

  const response = await submitPostRequest(url, headers, body)

  return response.jsonBody.choices[0].text
}



function authToken(): string {
  if(!process.env.OPEN_AI_API_KEY) {
    throw new Error('OPEN_AI_API_KEY is not defined in environment variables');
  }
  return process.env.OPEN_AI_API_KEY
}