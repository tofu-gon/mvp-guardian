import { agentAccountList } from '@/service/cookieagent/cookiefun.service'

export async function GET() {
  const agentlist = await agentAccountList()
  return new Response(JSON.stringify({
    agentlist: agentlist
  }), { status: 200 })
}
