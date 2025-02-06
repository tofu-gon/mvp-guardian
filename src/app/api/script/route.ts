import { getDiscordAnnounce } from '@/service/newspicks/discord.service'
import { getTwitterUserPost, TWITTER_INCIDENT_PJ_LIST } from '@/service/newspicks/twitter.service'
import { News, NewsResponse, TweetAccounts } from '@/service/newspicks/type'
import { openaiSummary } from '@/service/summary/openai.service'
import { judgePrompt } from '@/service/summary/prompthelper'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    // disco取得:
    const discoResponse = await getDiscordAnnounce()

    // tweeter取得
    const tweeterResponse: NewsResponse = {
      isSuccess: true,
      newsPosts: [],
      errorMsg: ''
    }
    const pjList: TweetAccounts[] = TWITTER_INCIDENT_PJ_LIST

    await Promise.all(pjList.map(async it => {
      const pjName = it.pjName
      const accountNameList = it.accountNames
      const tweet = await getTwitterUserPost(pjName, accountNameList)

      tweeterResponse.isSuccess = tweeterResponse.isSuccess && tweet.isSuccess
      tweeterResponse.newsPosts.push(...tweet.newsPosts)
      tweeterResponse.errorMsg += tweet.errorMsg
    }))

    // ###################################
    // 結果を結合
    const news: News[] = [...discoResponse.newsPosts, ...tweeterResponse.newsPosts]
    const usefulNews : News[] = []
    await Promise.all(
      news.map(async post => {
        const openAIRes = await openaiSummary(judgePrompt(post.content))
        const status = openAIRes.toLowerCase().trim()

        // AI判定が正しいやつのみ利用
        if(status == 'yes'){
          usefulNews.push(post)
        }
      })
    )

    // DB記録
    const supabase = await createClient();
    const {data, error} = await supabase.from("newsposts").upsert(
      usefulNews,
      {onConflict: 'postid,type'}
    )
    console.log('----------')
    console.log(data)
    console.log(error)

    const res = await supabase.from("newsposts").select()

    return new Response(JSON.stringify({
      databaseData: res
    }), { status: 200 })

  }catch(e: Error){
    return new Response(JSON.stringify({
      error: e.message
    }), {status: 500})
  }
}