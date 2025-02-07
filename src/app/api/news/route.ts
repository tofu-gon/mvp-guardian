import { createClient } from '@/utils/supabase/server';

export async function GET(){

  try{
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {data, error} = await supabase.from("newsposts").select()

    return new Response(JSON.stringify({
      news: data,
    }), {status: 200})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any){
    return new Response(JSON.stringify({
      success: false,
      result: [],
      error: e.message
    }), {status: 500})
  }
}