# InstaBoostLab

Instagram投稿のキャプションA/BテストをAIが評価・アドバイスするツールです。

## 🎯 プロダクトの目的

- 投稿キャプションのどちらが反応されやすいかをAIに評価してもらう
- ターゲット層やジャンルに応じたアドバイス・改善提案を受け取れる
- 将来的には、画像も含めた評価や投稿内容の自動最適化まで視野に

## 🛠 技術スタック

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **react-hook-form**
- **OpenAI GPT-4 Turbo**
- **API Routes**

## 🔮 今後の構想

- 画像 + キャプションの評価
- 投稿の自動改善 or 提案（リライト）
- ユーザー認証と履歴保存
- ABテストのスコア比較グラフなどの可視化

## 💡 アイデア共有用メモ

- ターゲット層（例：20代女性 / 美容 / カフェなど）に応じた評価
- 将来的にはInstagram API連携なども検討

---

## ✍ 使い方（ローカル環境）

```sh
pnpm install
pnpm dev
```

.env.local に以下を記入：

```sh
OPENAI_API_KEY=sk-xxxxx
```
