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

APIの公開にはGoogle Cloud CLI 587.0.0以降が必要です。変更をcommit・pushした後に実行します。

```bash
npm run deploy:api
```

`cloudbuild.yaml` の `options.workerRelease: regular` でビルドし、成功したイメージのSHA256ダイジェストを既存の `personalitymaster-api`（プロジェクト `gen-lang-client-0345215684`、`asia-northeast1`）へ公開します。
Docker BuildKitが対応しない `docker build --network cloudbuild` を生成する `gcloud run deploy --source` は使用しません。
既存のシークレット・環境変数・認証設定は維持します。ビルド失敗時は公開しません。
Cloud Runを変更せずにビルドだけ確認する場合は `npm run deploy:api -- --build-only` を実行します。
