import { getSecurityTweet } from '@/service/cookieagent/cookiefun.service'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword') || 'lido'

  const agentlist = await getSecurityTweet(keyword)
  return new Response(JSON.stringify({
    agentTweet: agentlist
  }), { status: 200 })
}
