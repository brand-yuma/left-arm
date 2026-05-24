---
name: create-client
description: "新しいクライアントのフォルダ構造を作成する。intake / assets / generate（01_brand / 02_specs / 03_production）の構造とテンプレートを自動生成する。"
disable-model-invocation: true
---

あなたは「プロジェクトセットアップエンジニア」です。
引数（$ARGUMENTS）に基づき、新しいクライアントのフォルダ構造を作成してください。

---

### Step 1: クライアント名の確定

`$ARGUMENTS` にクライアント名が含まれている場合はそのまま使用する。
含まれていない場合は AskUserQuestion で確認する:

> 新しいクライアントの名前を英数字スネークケースで入力してください。
> （例: natura_skin / ashiraku / left_arm）

---

### Step 2: フォルダ構造の作成

以下のコマンドで全フォルダを一括作成する:

```bash
mkdir -p clients/[クライアント名]/intake
mkdir -p clients/[クライアント名]/assets
mkdir -p clients/[クライアント名]/generate/01_brand/guidelines
mkdir -p clients/[クライアント名]/generate/02_specs
mkdir -p clients/[クライアント名]/generate/03_production/banners
mkdir -p clients/[クライアント名]/generate/03_production/sales-decks
mkdir -p clients/[クライアント名]/generate/03_production/lps
```

フォルダの役割:

```
clients/[クライアント名]/
├── intake/                          ← 入力情報（ヒアリング・CSV・要件定義）
├── assets/                          ← 素材（ロゴ・写真・既存デザイン）
└── generate/
    ├── 01_brand/                    ← 原液（全制作物の根拠）
    │   ├── brand-guideline.md       ← /create-guideline の出力
    │   ├── brand-tokens.json        ← /brand-guideline-architect の出力
    │   └── guidelines/              ← メディア別詳細ガイドライン
    │       ├── web-ui.md
    │       ├── print-dtp.md
    │       └── social-media.md
    ├── 02_specs/                    ← /ui・/ui-spec の出力
    │   └── [component]/
    │       ├── summary.md
    │       └── [component]_*.md
    └── 03_production/               ← 各制作スキルの成果物
        ├── banners/
        ├── sales-decks/
        └── lps/
```

---

### Step 3: ヒアリングシートテンプレートの生成

`clients/[クライアント名]/intake/hearing-sheet.md` を以下の内容で作成する:

```markdown
# [クライアント名] ブランドヒアリングシート

> 記入日: YYYY-MM-DD
> 担当者:

---

## 1. ブランド基本情報

- **会社名・ブランド名**:
- **業種・サービス内容**:
- **パーパス（存在意義）**:
- **ビジョン（目指す未来）**:
- **ミッション（日々の活動指針）**:
- **コアバリュー（大切にする価値観、3〜5個）**:

---

## 2. ターゲット・ペルソナ

- **メインターゲット（年齢・性別・職業・ライフスタイル）**:
- **ターゲットの主な悩み・課題（Pain Points）**:
- **ターゲットが求める理想・ゴール（Gain Points）**:
- **JTBD（Jobs To Be Done: このブランドで何を達成したいか）**:

---

## 3. 競合・差別化

- **主要競合（3社まで）**:
- **競合との差別化ポイント**:
- **競合のデザイン傾向（色・雰囲気・フォント）**:

---

## 4. ビジュアル方向性

- **希望カラーイメージ（色名・HEX・雰囲気）**:
- **NGカラー（避けたい色）**:
- **希望フォント・タイポグラフィの雰囲気**:
- **デザインのキーワード（3つ）**:
- **参考にしたいブランドのURL（3件まで）**:

---

## 5. 既存アセット

- **ロゴデータの有無**: [ ] あり（→ assets/ フォルダに配置） / [ ] なし
- **既存WebサイトURL**:
- **その他の既存制作物**:

---

## 6. 利用用途・技術要件

- **Web**: [ ] あり / [ ] なし
- **印刷・DTP**: [ ] あり / [ ] なし
- **SNS（Instagram / Twitter / LINE）**: [ ] あり / [ ] なし
- **アクセシビリティ（WCAG対応）**: [ ] 必須 / [ ] 任意 / [ ] 不要
- **Figma連携**: [ ] あり / [ ] なし
```

---

### Step 4: assets フォルダに README を配置

`clients/[クライアント名]/assets/README.md` を作成:

```markdown
# assets — [クライアント名]

このフォルダにはクライアントから提供された素材を配置してください。

## 配置ルール

| ファイル種別 | 命名規則 | 例 |
|------------|---------|-----|
| ロゴ（SVG） | `logo.svg` / `logo_white.svg` | ブランドロゴ本体 |
| ロゴ（PNG） | `logo.png` / `logo_2x.png` | 印刷用・高解像度 |
| ブランド写真 | `photo_[説明].jpg` | `photo_hero.jpg` |
| アイコン類 | `icon_[名前].svg` | `icon_arrow.svg` |
| 既存デザイン | `existing_[説明].pdf` | 既存カタログ等 |

## 注意事項
- ファイル名はスネークケース（小文字・アンダースコア）で統一
- 画像は最大解像度のものを配置（リサイズはワークフロー側で実施）
```

---

### Step 5: 完了報告と次のアクション案内

```
✅ クライアントフォルダを作成しました

clients/[クライアント名]/
├── intake/
│   └── hearing-sheet.md   ← ① ヒアリングシートを記入してください
├── assets/
│   └── README.md          ← ② ロゴ・写真をここに配置してください
└── generate/
    ├── 01_brand/          ← ③ /create-guideline 実行後に自動生成されます
    ├── 02_specs/          ← /ui・/ui-spec の出力先
    └── 03_production/     ← /generate-banner 等の出力先

次のステップ:
① intake/hearing-sheet.md を記入する
② assets/ にロゴ・写真を配置する
③ /create-guideline [クライアント名] を実行してブランドガイドライン（原液）を生成する
```
