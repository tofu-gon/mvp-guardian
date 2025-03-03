import { getRecentTweets, getTweetReplyComments, getUserProfile } from '@/service/yoake-ai/twitter-user-api.service';
import { NextRequest } from 'next/server';

// Twitter APIクライアントの初期化
export async function GET(req: NextRequest) {
  try {
    // URLからユーザー名を取得
    const username = req.nextUrl.searchParams.get('userName')

    if (!username) {
      return new Response(
        JSON.stringify({ error: '[userName] is required' }),
        { status: 400 }
      );
    }
    const userInfo = await getUserProfile(username)
    const tweets = await getRecentTweets(userInfo.id)
    const tweetsWithReplys = await Promise.all(tweets.map(async (tweet: {id: string}) => {
      const replys = await getTweetReplyComments(tweet.id)
      return {...tweet, replys: replys}
    }))

    return new Response(JSON.stringify({
      userinfo: userInfo,
      tweets: tweetsWithReplys
    }), {status: 200})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (e: any) {
    return new Response(JSON.stringify({
      success: false,
      result: [],
      error: e.message
    }), {status: 500})
  }
}
