// 既存のコミュニティにbotを直接参加させることが難しく(管理者権限がないため)
// アナウンスチェンネルの内容を転送し、転送先のチャンネルにbotを入れてメッセージを取得しています。
import { submitGetRequest } from '../apiclient';
import { News, NewsResponse } from './type';

export async function getDiscordAnnounce(afterId?: string): Promise<NewsResponse> {
  const url = 'https://discord.com/api/v10/channels/1335967727025782805/messages'; // customized announces channel

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bot ${authToken()}`,
  }

  const params: Record<string, string> = {
    'after': afterId || '1335975618898296836', // 特定メッセージ以降
    'limit': '100',
  }

  const response = await submitGetRequest(url, headers, params)

  if(response.statusCode == 200){
    return {
      isSuccess: true,
      newsPosts: response.jsonBody.map((post: {content: string, embeds?: {title: string, description: string}[], timestamp: string, id: string, author: { username: string}}): News => {
        return {
          postid: post.id,
          type: 'discord',
          content: post.content + post.embeds?.map(emb => `\n${emb.title}\n"""\n${emb.description}\n"""`).join(''),
          project: post.author.username.toLowerCase().includes('uniswap') ? 'uniswap' :
                    post.author.username.toLowerCase().includes('aave') ? 'aave' :
                    post.author.username,
          author: post.author.username,
          timestamp: post.timestamp,
        }
      }),
      errorMsg: ''
    }
  } else {
    return {
      isSuccess: false,
      newsPosts: [],
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
