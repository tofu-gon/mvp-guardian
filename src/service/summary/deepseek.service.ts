import { submitPostRequest } from '../apiclient';
import { summaryPrompt } from './prompthelper';

// TODO: キーの再生成が必要かも？
// ref: https://api-docs.deepseek.com/
export async function deepseekSummary(newsTitle: string[], tweets: string[]): Promise<string> {
  const url = 'https://api.deepseek.com/v1/completions'

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }

  const body = {
    "model": "deepseek-chat",
    "prompt": summaryPrompt(newsTitle, tweets),
    "max_tokens": 100
  }

  const response = await submitPostRequest(url, headers, body)

  console.log(response)

  return "";
}

function authToken(): string {
  if(!process.env.DEEPSEEK_API_KEY){
    throw new Error('DEEPSEEK_API_KEY is not defined in environment variables');
  }
  return process.env.DEEPSEEK_API_KEY
}