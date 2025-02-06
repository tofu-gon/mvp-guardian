import { submitGetRequest } from '../apiclient';
import { News, NewsResponse } from './type';

const MAX_SIZE = '10' // 取得するツイート数を指定（最大100件）

export async function getTwitterUserPost(pjName: string, accountNameList: string[]): Promise<NewsResponse> {
  const USER_NAME_LIST = accountNameList

  let isSuccess = false
  const news: News[] = []
  let errorMsg = ''

  await Promise.all(USER_NAME_LIST.map(async name => {
    const id = await getUserIdByAccountName(name)
    console.log(name, ' -> ', id)

    const url = `https://api.twitter.com/2/users/${id}/tweets`

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      authorization: `Bearer ${authToken()}`,
    }

    const params: Record<string, string> = {
      'tweet.fields': 'text,created_at',
      max_results: MAX_SIZE,
    }

    const response = await submitGetRequest(url, headers, params)

    if(response.statusCode == 200) {
      const tmp = response.jsonBody.data.map((tweet: { id: string, text: string, created_at: string }):News => {
        return {
          postid: tweet.id,
          type: 'tweet',
          content: tweet.text,
          project: pjName,
          author: name,
          timestamp: tweet.created_at,
        }
      })
      isSuccess = true
      news.push(...tmp)
    } else {
      errorMsg = errorMsg + `Fail to get ${name}'s info, code: ${response.statusCode}, reason: ${response.jsonBody.detail}`
      console.log(errorMsg)
    }
  }))

  return {
    isSuccess,
    newsPosts: news,
    errorMsg
  }
}

// ############################################################################################################
// ############################################################################################################

async function getUserIdByAccountName(username: string): Promise<string> {
  const url = `https://api.twitter.com/2/users/by/username/${username}`

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }

  const response = await submitGetRequest(url , headers)

  return response.jsonBody.data.id
}

function authToken(): string{
  if(!process.env.TWITTER_BEARER_TOKEN){
    throw new Error('TWITTER_BEARER_TOKEN is not defined in environment variables');
  }
  return process.env.TWITTER_BEARER_TOKEN
}