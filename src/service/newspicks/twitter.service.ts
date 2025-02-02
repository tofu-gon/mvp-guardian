import { submitGetRequest } from '../apiclient';
import { NewsResponse } from './type';

// TODO: sort_orderで話題ツイート検索
// TODO: meta.next_tokenを駆使して上位100件ツイートを取得するように改修

export async function getTwitterRecentPost(keyword: string): Promise<NewsResponse>{
  const url = 'https://api.twitter.com/2/tweets/search/recent';

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }

  const params: Record<string, string> = {
    query: keyword,
    'tweet.fields': 'text,created_at',
    max_results: '100', // 取得するツイート数を指定（最大100件）
    sort_order: 'relevancy', // 話題のツイート検索ができる
  }

  const response = await submitGetRequest(url, headers, params)
  if(response.statusCode == 200) {
    return {
      isSuccess: true,
      news: response.jsonBody.data.map((tweet: { text: string }) => tweet.text),
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

export async function getTwitterUserPost(): Promise<NewsResponse> {
  const USER_NAME_LIST = ["cookiedotfun"]

  let isSuccess = false
  const news: string[] = []
  let errorMsg = ''

  await Promise.all(USER_NAME_LIST.map(async name => {
    const id = await getUserIdByAccountName(name)
    console.log(name, ':', id)

    const url = `https://api.twitter.com/2/users/${id}/tweets`

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      authorization: `Bearer ${authToken()}`,
    }

    const params: Record<string, string> = {
      'tweet.fields': 'text,created_at',
      max_results: '100',
    }

    const response = await submitGetRequest(url, headers, params)

    if(response.statusCode == 200) {
      const tmp = response.jsonBody.data.map((tweet: { text: string }) => tweet.text)
      isSuccess = true
      news.push(...tmp)
    } else {
      errorMsg = errorMsg + `Fail to get ${name}'s info, code: ${response.statusCode}, reason: ${response.jsonBody.detail}`
      console.log(errorMsg)
    }
  }))

  return {
    isSuccess,
    news,
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