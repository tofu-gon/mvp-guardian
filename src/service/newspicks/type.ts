export type NewsResponse = {
  isSuccess: boolean,
  newsPosts: News[],
  errorMsg: string,
}

export type News = {
  postid: string,
  type: string,
  content: string,
  project: string,
  author: string,
  timestamp: string,
}


export type TweetAccounts = {
  pjName: string,
  accountNames: string[]
}