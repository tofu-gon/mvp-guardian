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

- `http://localhost:3000/api/news?keyword=uniswap` で、直近のニュース記事をtwitterとgoogle newsから取得できます。

- `http://localhost:3000/api/summary?keyword=uniswap` で、(openaiによる)記事のまとめ情報と、上記ニュース記事のjsonを取得できます。
