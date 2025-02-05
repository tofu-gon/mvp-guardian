export async function GET() {
  const pjList = ['uniswap']

  try {

  }catch(e: Error){
    return new Response(JSON.stringify({
      error: e.message
    }), {status: 500})
  }
}