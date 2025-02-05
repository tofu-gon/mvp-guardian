# 利用方法

1. ターミナルで、変数ファイルを作成してください:

```
touch .env.local
```

2. `.env.local` の中身は下記内容で置き換えてください

```bash
TWITTER_BEARER_TOKEN='xxxxxx'

SERP_API_KEY='xxxxxxx'

OPEN_AI_API_KEY='xxxxx'

DEEPSEEK_API_KEY='xxxxx'
```

3. アプリ起動し

```bash
$ npm run install
$ npm run dev
```

ブラウザーで、

- `http://localhost:3000/api/script` で、
  - 直近のtwitterとdiscordのポストを抽出しdbに登録します。
  - ポスト内容をopenAIで大事かどうかを判定してもらう
  - openAIが大事と判定したものをDBに登録する
  - DBの最新結果をAPIのresponseに設定して表示する