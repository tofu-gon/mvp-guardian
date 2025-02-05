import { createClient } from '@/utils/supabase/server';
import { BookmarkData } from '@/utils/supabase/type';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const bookmarksample:BookmarkData = {
    project: 'sample4',
    account: 'app',
    bookmark: '!!!!!fjsssssssss'
  }

  const {data, error} = await supabase.from("bookmark").upsert(
    [bookmarksample],
    {onConflict: 'project,account'}
  )
  console.log('--------------')
  console.log(data)
  console.log(error)

  const a = await supabase.from("bookmark").select()
  console.log(a)

  return new Response(JSON.stringify({
    result: [],
    err: '',
  }), {status: 200})
}