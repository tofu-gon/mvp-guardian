import { submitGetRequest } from '../apiclient'
import { News, NewsResponse } from '../newspicks/type'

// ref: https://docs.cookie.fun/#/api/endpoints

export async function agentAccountList() {
  const res = []

  const url = `https://api.cookie.fun/v2/agents/agentsPaged`
  const headers: Record<string, string> = {
    'x-api-key': authToken(),
  }

  for(let i = 1; i <= 56; i ++){
    const params: Record<string, string> = {
      interval: '_7Days',
      pageSize: '25', // max
      page: `${i}`
    }

    const response = await submitGetRequest(url, headers, params)

    res.push(...response.jsonBody.ok.data.map((ag: {agentName: string, twitterUsernames: string[]}) => {
      return {
        [ag.agentName]: ag.twitterUsernames,
      }
    }))
  }

  return res
}

export async function getSecurityTweet(pjName: string): Promise<NewsResponse>{
  const url = `https://api.cookie.fun/v1/hackathon/search/${pjName} security`
  const headers: Record<string, string> = {
    'x-api-key': authToken(),
  }
  console.log(Date())
  const param: Record<string, string> = {
    from: getFormattedDate(7),
    to: getFormattedDate(0)
  }

  const response = await submitGetRequest(url, headers, param)
  console.log(response.jsonBody.ok.map((post:{authorUsername: string, createdAt: string, text: string}):News => {
    return {
      postid: post.authorUsername + post.createdAt,
      type: pjName,
      content: post.text,
      project: pjName,
      author: post.authorUsername,
      timestamp: post.createdAt
    }
  }))

  if(response.statusCode == 200){
    return {
      isSuccess: true,
      newsPosts: response.jsonBody.data,
      errorMsg: ''
    }
  }else{
    return {
      isSuccess: false,
      newsPosts: [],
      errorMsg: `API ERROR, error code ${response.statusCode}, error reason: ${response.jsonBody.detail}`
    }
  }
}


// #####################################################

function getFormattedDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`;
}

function authToken(): string {
  if(!process.env.SWARM_API_KEY) {
    throw new Error('SWARM_API_KEY is not defined in environment variables');
  }
  return process.env.SWARM_API_KEY
}