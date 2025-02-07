import { getSecurityTweet } from '@/service/cookieagent/cookiefun.service'
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

    // twitter取得
    const twitterResponse: NewsResponse = {
      isSuccess: true,
      newsPosts: [],
      errorMsg: ''
    }
    const pjList: TweetAccounts[] = TWITTER_INCIDENT_PJ_LIST

    await Promise.all(pjList.map(async it => {
      // 公式APIより結果取得
      const pjName = it.pjName
      const accountNameList = it.accountNames
      const officialTwitter = await getTwitterUserPost(pjName, accountNameList)

      twitterResponse.isSuccess = twitterResponse.isSuccess && officialTwitter.isSuccess
      twitterResponse.newsPosts.push(...officialTwitter.newsPosts)
      twitterResponse.errorMsg += officialTwitter.errorMsg

      // SWARM APIで関連pjのsecurityポストを取得
      if(it.pjName !== 'security') {
        const referenceTwitter = await getSecurityTweet(it.pjName)

        twitterResponse.isSuccess = twitterResponse.isSuccess && referenceTwitter.isSuccess
        twitterResponse.newsPosts.push(...referenceTwitter.newsPosts)
        twitterResponse.errorMsg += referenceTwitter.newsPosts
      }
    }))

    // ###################################
    // 結果を結合
    const news: News[] = [...discoResponse.newsPosts, ...twitterResponse.newsPosts]
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