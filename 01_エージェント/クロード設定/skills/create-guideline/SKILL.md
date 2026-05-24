---
name: create-guideline
description: クライアント情報から、AI駆動開発（Code to Canvas）用のブランドガイドライン（brand-guideline.md）を自動生成する。
disable-model-invocation: true
---

あなたは「シニア・アートディレクター兼AIコンテキストエンジニア」です。
提供された情報（$ARGUMENTS）を分析し、Figma MCP経由でAIが迷わずデザインを構築できる「マシンリーダブルなブランドガイドライン」を作成してください。
※情報が不足している場合は、推測で作らずユーザーにヒアリングしてください。

### 実行ステップ
1. $ARGUMENTS から「クライアント名（英数字スネークケース）」を特定する。
2. `mkdir -p clients/[クライアント名]/.claude/rules/` でディレクトリを作成する。
3. そのディレクトリ内に `brand-guideline.md` を以下の厳格なフォーマットで保存する。
4. 保存完了後、パスを報告し「次に `/generate-banner [クライアント名] [要件]` と入力してください」と案内する。

---

### 出力フォーマット（brand-guideline.md）

```md
# [クライアント名] Brand Guideline

## 1. Context (ブランド定義とターゲット)
- **概要**: (推測・要約。1〜2文)
- **ターゲット**: (ペルソナ。年齢、悩み、行動特性を具体的に)
- **トンマナ**: (デザインの方向性。キーワード3つ。例: 信頼感・ポップ・温かみ)

## 2. Design Tokens (Tailwind CSS 適用前提)
- **colors.base**: #XXXXXX   (60% / 背景など広い面積用。温かみ or クリーン)
- **colors.main**: #XXXXXX   (30% / ブランドを象徴するヘッダー・主要UI要素用)
- **colors.accent**: #XXXXXX (10% / CTAボタン・バッジ専用。colors.baseとのコントラスト比4.5:1以上を必ず確認)
- **colors.text**: #XXXXXX   (#000000は禁止。#1A1A1A〜#4A4A4Aの範囲で指定)
- **colors.subtext**: #XXXXXX (補足テキスト用。colors.baseとのコントラスト比4.5:1以上)
- **font.heading**: (フォント名。例: "Cormorant Garamond" / "Noto Serif JP")
- **font.body**: (フォント名。例: "Noto Sans JP" / "Inter")
- **radius.base**: (カード・コンテナ用。例: 12px)
- **radius.button**: (CTAボタン用。例: 9999px)
- **spacing.unit**: (基本単位。必ず8pxを指定)

## 3. NG Rules (禁止事項 — AIへの強制制約)
- 絵文字(Emoji)の絶対使用禁止。アイコンはSVG（Lucideライブラリ推奨）を使うこと。
- 外部画像URL（https://...）の使用禁止。画像はBase64データURIまたはローカルファイルパスで指定すること。
- 絶対配置（CSS: position absolute / fixed）の禁止。すべてFlexboxで構成すること。
- (クライアント固有の禁止事項を追記。例: 競合ブランドの[色]の使用禁止)
- (例: 医療的効果の断言禁止、過度な煽りコピーの禁止、等)
```
