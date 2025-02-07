import { submitGetRequest } from '../apiclient';
import { News, NewsResponse, TweetAccounts } from './type';

export const TWITTER_INCIDENT_PJ_LIST: TweetAccounts[] = [
  // {
  //   pjName: "Lido",
  //   accountNames: ["cobie", "LidoFinance"]
  // },
  {
    pjName: "Aave",
    accountNames: ["StaniKulechov", "AaveAave"]
  },
  // {
  //   pjName: "EigenLayer",
  //   accountNames: ["sreeramkannan", "eigenlayer"]
  // },
  // {
  //   pjName: "ether.fi",
  //   accountNames: ["ether_fi"]
  // },
  // {
  //   pjName: "Binance staked ETH (BETH)",
  //   accountNames: ["cz_binance", "Binance"]
  // },
  {
    pjName: "Uniswap",
    accountNames: ["haydenzadams", "Uniswap"]
  },
  // {
  //   pjName: "Ethena Labs (USDe)",
  //   accountNames: ["leptokurtic_", "ethena_labs"]
  // },
  // {
  //   pjName: "JustLend",
  //   accountNames: ["justinsuntron", "trondao"]
  // },
  // {
  //   pjName: "MakerDAO (Spark/Sky)",
  //   accountNames: ["RuneKek", "MakerDAO"]
  // },
  // {
  //   pjName: "Babylon",
  //   accountNames: ["baby_fisherman", "BabylonLabs_io"]
  // },
  // {
  //   pjName: "STRX Finance",
  //   accountNames: ["justinsuntron", "trondao"]
  // },
  // {
  //   pjName: "Jito (JitoSOL)",
  //   accountNames: ["Jito_Labs"]
  // },
  // {
  //   pjName: "Morpho Protocol",
  //   accountNames: ["PaulFrambot", "MorphoLabs"]
  // },
  // {
  //   pjName: "Spark Protocol",
  //   accountNames: ["RuneKek", "MakerDAO"]
  // },
  // {
  //   pjName: "Compound",
  //   accountNames: ["rleshner", "CompoundFinance"]
  // },
  // {
  //   pjName: "Rocket Pool",
  //   accountNames: ["Darius_Jito", "Rocket_Pool"]
  // },
  // {
  //   pjName: "Binance staked SOL (BSOL)",
  //   accountNames: ["cz_binance", "Binance"]
  // },
  // {
  //   pjName: "Raydium",
  //   accountNames: ["RaydiumProtocol"]
  // },
  // {
  //   pjName: "PancakeSwap",
  //   accountNames: ["PancakeSwap"]
  // },
  // {
  //   pjName: "Convex Finance",
  //   accountNames: ["ConvexFinance"]
  // },
  {
    pjName: "security",
    accountNames: [
      "SlowMist_Team", "peckshield", "CertiK",
      "OpenZeppelin",
      "RevokeCash",
      "chain_security",
      "hackenclub",
      "WuBlockchain",
      "samczsun",
      "Mudit__Gupta",
      "zachxbt",
      "tayvano_",
      "FrankResearcher",
      "PeckShieldAlert",
      "CertiKAlert",
      "CyversAlerts",
      "De_FiSecurity",
      "WatcherGuru"]
  }
]

const MAX_SIZE = '10' // 取得するツイート数を指定（最大100件）

export async function getTwitterUserPost(pjName: string, accountNameList: string[]): Promise<NewsResponse> {
  const USER_NAME_LIST = accountNameList

  let isSuccess = false
  const news: News[] = []
  let errorMsg = ''

  await Promise.all(USER_NAME_LIST.map(async name => {
    const id = await getUserIdByAccountName(name)
    console.log(name, ' -> ', id)

    const url = `https://api.twitter.com/2/users/${id}/tweets`

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      authorization: `Bearer ${authToken()}`,
    }

    const params: Record<string, string> = {
      'tweet.fields': 'text,created_at',
      max_results: MAX_SIZE,
    }

    const response = await submitGetRequest(url, headers, params)

    if(response.statusCode == 200) {
      const tmp = response.jsonBody.data.map((tweet: { id: string, text: string, created_at: string }):News => {
        return {
          postid: tweet.id,
          type: 'tweet',
          content: tweet.text,
          project: pjName,
          author: name,
          timestamp: tweet.created_at,
        }
      })
      isSuccess = true
      news.push(...tmp)
    } else {
      errorMsg = errorMsg + `Fail to get ${name}'s info, code: ${response.statusCode}, reason: ${response.jsonBody.detail}`
      console.log(errorMsg)
    }
  }))

  return {
    isSuccess,
    newsPosts: news,
    errorMsg
  }
}

// ############################################################################################################
// ############################################################################################################

async function getUserIdByAccountName(username: string): Promise<string> {
  const url = `https://api.twitter.com/2/users/by/username/${username}`

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${authToken()}`,
  }

  const response = await submitGetRequest(url , headers)

  return response.jsonBody.data.id
}

function authToken(): string{
  if(!process.env.TWITTER_BEARER_TOKEN){
    throw new Error('TWITTER_BEARER_TOKEN is not defined in environment variables');
  }
  return process.env.TWITTER_BEARER_TOKEN
}