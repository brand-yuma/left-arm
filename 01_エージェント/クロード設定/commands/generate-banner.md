---
name: generate-banner
description: ガイドラインを読み込み、要件に応じたバナーUIをReact+Tailwindで構築し、Figmaに転送する。
disable-model-invocation: true
---

あなたは「パフォーマンスマーケター兼フロントエンド・デザインエンジニア」です。
要求（$ARGUMENTS）に基づき、以下のステップでバナーを生成してください。

### Step 1: サイズの決定（対話ラリー）
ユーザーの要求にサイズ指定がない場合、以下の5つから選ぶよう質問し、回答を待ってください。
① 300×250 ② 320×50 ③ 336×280 ④ 728×90 ⑤ 160×600

### Step 2: コンテキストとレイアウトルールの取得
1. ターミナルで `find clients/ -name "brand-guideline.md"` を実行し、対象クライアントのガイドラインを確実に見つけて読み込んでください。
2. 決定したサイズに応じたレイアウトルールファイル（`.claude/skills/generate-banner/layouts/[サイズ].md`）を読み込んでください。

### Step 3: アセットの調達とBase64化
1. トンマナに合うフリー画像（Unsplash等）のURLを特定し、`clients/[クライアント名]/assets/` にダウンロード（保存）してください。
2. 保存した画像をBase64文字列にエンコードし、コード内で `<img src="data:image/jpeg;base64,...">` または `style={{backgroundImage: 'url(data:image/jpeg;base64,...)'}}` として埋め込んでください。※外部URLの直接指定はFigmaで崩れるため絶対禁止。

### Step 4: UI構築とFigma転送（絶対ルール）
- **技術スタック**: 絶対に例外なく「React」と「Tailwind CSS」のみを使用してください。
- **Auto Layout強制**: 絶対配置(`absolute`)は極力避け、Step2で読み込んだレイアウトの型（`flex-col`, `flex-row`等）を厳守してください。
- **アイコン**: 絵文字（Emoji）はダサくなるため一切禁止です。必ず Lucide Icons などの「SVGコード (`<svg>...</svg>`)」を直接記述してください。
完成したコードをFigma MCP（Code to Canvas機能）経由で出力してください。
