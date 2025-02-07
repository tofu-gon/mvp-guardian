import { getWeb3Services } from '@/service/pjservice/zerion.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  if(!address){
    return new Response(JSON.stringify({errorMsg: 'required address'}), {status: 400})
  }

  const serviceList: string[] = await getWeb3Services(address)

  return new Response(JSON.stringify({
    serviceList: serviceList
  }), {status: 200})
}