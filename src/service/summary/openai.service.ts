import { submitPostRequest } from '../apiclient';

const PROMPT_TEMP=`
Please provide a concise summary of the following list of article titles and the latest Twitter tweets. The goal is to combine the content from both the articles and tweets into a unified summary, excluding redundant or unimportant content (such as promotional tweets or the main headlines of news articles). Focus on the key points and insights.

### Article Titles:
{NEWS_TITLE}

### Latest Twitter Tweets:
{TWEETS}

Please summarize the key points and insights, excluding repetitive or less significant content.
`;

export async function openaiSummary(newsTitle: string[], tweets: string[]): Promise<string> {
  const prompt = PROMPT_TEMP.replace("{NEWS_TITLE}", newsTitle.map(item => `* ${item}`).join("\n"))
                            .replace("{TWEETS}", tweets.map(item => `* ${item}`).join("\n"))

  console.log(prompt)

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
  console.log(response.jsonBody)

  return response.jsonBody.choices[0].text
}



function authToken(): string {
  if(!process.env.OPEN_AI_API_KEY) {
    throw new Error('OPEN_AI_API_KEY is not defined in environment variables');
  }
  return process.env.OPEN_AI_API_KEY
}