import { getUserProfile } from '@/service/yoake-ai/user-profile.service';
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
    const res = await getUserProfile(username)

    return new Response(JSON.stringify({
      result: res
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
