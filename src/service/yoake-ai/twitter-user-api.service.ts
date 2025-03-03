import { submitGetRequest } from '../apiclient';


export async function getUserProfile(userName: string) {
  const url = `https://api.twitter.com/2/users/by/username/${userName}`

  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }

  const params = {
    'user.fields': 'description',
  }

  const response = await submitGetRequest(url, headers, params)

  return response.jsonBody.data
}

export async function getRecentTweets(userId: string) {
  const url = `https://api.twitter.com/2/users/${userId}/tweets`

  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }
  const params = {
    'max_results': '5',
    'exclude': 'retweets,replies',
    'tweet.fields': 'public_metrics',
  }

  const response = await submitGetRequest(url, headers, params)

  return response.jsonBody.data
}

export async function getTweetReplyComments(tweetId: string) {
  const url = `https://api.twitter.com/2/tweets/search/recent`

  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }

  const params = {
    query: `conversation_id:${tweetId}`,
    'tweet.fields': 'author_id,created_at,public_metrics',
  }

  const response = await submitGetRequest(url, headers, params)

  return response.jsonBody.data
}

function authToken(): string{
  if(!process.env.TWITTER_BEARER_TOKEN){
    throw new Error('TWITTER_BEARER_TOKEN is not defined in environment variables');
  }
  return process.env.TWITTER_BEARER_TOKEN
}