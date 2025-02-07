// import { submitGetRequest } from '../apiclient';
// import { NewsResponse } from './type';

// export async function getGoogleNews(keyword: string): Promise<NewsResponse> {
//   const newsSiteQuery= ['cointribune.com', 'cointelegraph.com'].map(site => `site:${site}`).join(' OR ')

//   const url = 'https://serpapi.com/search.json';

//   const headers: Record<string, string> = {
//     'content-type': 'application/json',
//   }

//   const params: Record<string, string> = {
//     engine: 'google_news',
//     q: `${keyword} ${newsSiteQuery}`,
//     hl: 'en',
//     gl: 'us',
//     tbs: 'qdr:d', // 過去24時間のみ
//     num: '20',
//     api_key: authToken(),
//   }

//   const response = await submitGetRequest(url, headers, params)

//   if(response.statusCode == 200){
//     return {
//       isSuccess: true,
//       news: response.jsonBody.news_results.map((news: {title: string}) => news.title),
//       errorMsg: ''
//     }
//   } else {
//     return {
//       isSuccess: false,
//       news: [],
//       errorMsg: `API ERROR, error code ${response.statusCode}, error reason: ${response.jsonBody.detail}`
//     }
//   }
// }


// function authToken(): string{
//   if(!process.env.SERP_API_KEY){
//     throw new Error('SERP_API_KEY is not defined in environment variables');
//   }

//   return process.env.SERP_API_KEY
// }