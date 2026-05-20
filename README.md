# PersonalityM@ster

https://thousandsofties.github.io/PersonalityMaster/

PersonalityM@ster は、好きなアイドルを選ぶと、AI があなたの好みの傾向を分析しておすすめのアイドルを提案してくれる、ファンメイドの性格・嗜好分析アプリです。

## 遊び方

1. 上記のアプリURLを開きます。
2. 好きなアイドルのカードをタップ、またはクリックして選択します。
3. 必要に応じて、タイプやユニットのフィルターで表示するアイドルを絞り込みます。
4. 1人以上選んだら、分析ボタンを押します。
5. AIによる好みの分析結果と、おすすめアイドルを確認します。
6. 別の組み合わせを試したいときは、最初からやり直せます。

スマートフォンでは、アイドルカードはタップで選択します。アイドル一覧の領域をスワイプすると、一覧をスクロールできます。

## アプリ構成

- フロントエンド: React + TypeScript + Vite。GitHub Pages にデプロイしています。
- APIプロキシ: `server/index.js` の Express サーバー。Google Cloud Run にデプロイしています。
- AIバックエンド: Gemini API。APIキーがブラウザに露出しないよう、Cloud Run のプロキシ経由で呼び出します。

## ローカル開発

依存関係をインストールします。

```bash
npm install
```

フロントエンドを起動します。

```bash
npm run dev
```

APIプロキシをローカルで起動します。

```bash
npm run dev:server
```

フロントエンドは `VITE_API_URL` で API のベースURLを受け取ります。
公開環境の API URL は GitHub Actions の環境変数で設定します。

## デプロイ

GitHub Pages へのデプロイは `.github/workflows/deploy-pages.yml` で行います。

Cloud Run の API プロキシは以下のエンドポイントを持ちます。

- `GET /api/health`
- `POST /api/generate` with `{ prompt, model }`

Gemini APIキーは Google Secret Manager に `GEMINI_API_KEY` として保存しています。
