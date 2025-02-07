import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(){

  try{
    const supabase = await createClient();

    const {data, error} = await supabase.from("newsposts").select()

    return new Response(JSON.stringify({
      news: data,
    }), {status: 200})
  } catch (e: Error){
    return new Response(JSON.stringify({
      success: false,
      result: [],
      error: e.message
    }), {status: 500})
  }
}