const SUMMARY_PROMPT_TEMP=`
Please provide a concise summary of the following list of article titles and the latest Twitter tweets. The goal is to combine the content from both the articles and tweets into a unified summary, excluding redundant or unimportant content (such as promotional tweets or the main headlines of news articles). Focus on the key points and insights.

### Article Titles:
{NEWS_TITLE}

### Latest Twitter Tweets:
{TWEETS}

Please summarize the key points and insights, excluding repetitive or less significant content.
`;

export function summaryPrompt(newsTitle: string[], tweets: string[]): string {
  return SUMMARY_PROMPT_TEMP.replace("{NEWS_TITLE}", newsTitle.map(item => `* ${item}`).join("\n"))
                            .replace("{TWEETS}", tweets.map(item => `* ${item}`).join("\n"))
}

const JUDGE_PROMPT_TEMP=`
Analyze the following post and determine if it contains important information, such as news or significant events. Respond with only 'yes' or 'no' and nothing else. Here is the post:

{POST}
`
export function judgePrompt(post: string): string {
  return JUDGE_PROMPT_TEMP.replace("{POST}", post)
}