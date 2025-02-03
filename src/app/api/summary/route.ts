import { getGoogleNews } from '@/service/newspicks/serp.service';
import { getTwitterRecentPost, getTwitterUserPost } from '@/service/newspicks/twitter.service';
import { openaiSummary } from '@/service/summary/openai.service';
import { NextRequest } from 'next/server';


// MEMO: 現状は、twitte10件のみ、news20件のみとってます。件数増やしていこう
export async function GET(req: NextRequest){
  const keyword = req.nextUrl.searchParams.get('keyword') || 'uniswap'
  console.log(keyword)

  try{
    const twitterRecentPost = await getTwitterRecentPost(keyword); // ツイッター、直近の関連キーワードツイート
    const twitterUserPost = await getTwitterUserPost(); // ツイッター、指定ユーザーの直近ツイート
    const googleNews = await getGoogleNews(keyword);

    const newsTitle = googleNews.news
    const tweets = [...twitterRecentPost.news, ...twitterUserPost.news]

    return new Response(JSON.stringify({
      openaiSummary: await openaiSummary(newsTitle, tweets),
      twitterRecentPost: twitterRecentPost,
      twitterUserPost: twitterUserPost,
      googleNews: googleNews
    }), {status: 200})
  } catch (e: Error){
    return new Response(JSON.stringify({
      success: false,
      result: [],
      error: e.message
    }), {status: 500})
  }
}



// https://serpapi.com/search.json?engine=google&q=&api_key=${API_KEY}`