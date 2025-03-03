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

  return response.jsonBody
}


function authToken(): string{
  if(!process.env.TWITTER_BEARER_TOKEN){
    throw new Error('TWITTER_BEARER_TOKEN is not defined in environment variables');
  }
  return process.env.TWITTER_BEARER_TOKEN
}