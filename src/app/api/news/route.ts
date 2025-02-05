import { getDiscordAnnounce } from '@/service/newspicks/discord.service';
import { getGoogleNews } from '@/service/newspicks/serp.service';
import { getTwitterRecentPost, getTwitterUserPost } from '@/service/newspicks/twitter.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest){
  const keyword = req.nextUrl.searchParams.get('keyword') || 'uniswap'
  console.log(keyword)

  try{
    return new Response(JSON.stringify({
      twitterRecentPost: await getTwitterRecentPost(keyword), // ツイッター、直近の関連キーワードツイート
      twitterUserPost: await getTwitterUserPost("web3", ["cookiedotfun"]), // ツイッター、指定ユーザーの直近ツイート
      googleNews: await getGoogleNews(keyword),
      discordAnnounce: await getDiscordAnnounce(),
    }), {status: 200})
  } catch (e: Error){
    return new Response(JSON.stringify({
      success: false,
      result: [],
      error: e.message
    }), {status: 500})
  }
}