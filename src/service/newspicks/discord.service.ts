// 既存のコミュニティにbotを直接参加させることが難しく(管理者権限がないため)
// アナウンスチェンネルの内容を転送し、転送先のチャンネルにbotを入れてメッセージを取得しています。
import { submitGetRequest } from '../apiclient';
import { NewsResponse } from './type';

export async function getDiscordAnnounce(): Promise<NewsResponse> {
  const url = 'https://discord.com/api/v10/channels/1335967727025782805/messages'; // customized announces channel

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bot ${authToken()}`,
  }

  const params: Record<string, string> = {
    'after': '1335975618898296836', // 特定メッセージ以降
    'limit': '10',
  }

  const response = await submitGetRequest(url, headers, params)

  if(response.statusCode == 200){
    return {
      isSuccess: true,
      news: response.jsonBody.map((msg: {content: string}) => msg.content),
      errorMsg: ''
    }
  } else {
    return {
      isSuccess: false,
      news: [],
      errorMsg: `API ERROR, error code ${response.statusCode}, error reason: ${response.jsonBody.detail}`
    }
  }
}

function authToken(): string {
  if(!process.env.DISCORD_BOT_TOKEN){
    throw new Error('DISCORD_BOT_TOKEN is not defined in environment variables');
  }
  return process.env.DISCORD_BOT_TOKEN
}
