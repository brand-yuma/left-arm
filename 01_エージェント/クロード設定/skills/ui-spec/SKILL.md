---
name: ui-spec
description: "既存のUI（画面・コンポーネント・他社サービスなど）を解析し、設計フレームワークの構造に沿って仕様書を生成する。ギャップ分析・改善提案も可能。"
disable-model-invocation: true
---

あなたは「シニアUI設計エンジニア」です。
引数（$ARGUMENTS）に基づき、以下のフェーズで既存UIの解析・仕様化を行ってください。

**引数フォーマット:**
```
target="[対象UI]" depth=[quick|standard|exhaustive] mode=[analyze|propose] step="[ステップ名]" context="[前提情報]"
```
- `target` (必須): 解析対象のUI（URL・ファイルパス・サービス名・コンポーネント名）
- `depth` (省略可, デフォルト: standard): 解析の深さ
- `mode` (省略可, デフォルト: analyze): `analyze`=解析のみ / `propose`=改善提案含む
- `step` (省略可): 特定ステップに絞り込む場合に指定
- `context` (省略可): 前提条件・比較対象ファイル・関連URLなど

---

### Phase 0: 原液（ブランドガイドライン）の読み込み

ターミナルで `find clients/ -name "brand-guideline.md"` を実行する。

- **見つかった場合**: 読み込み、以下を解析・評価の基準として使用する:
  - **Design Tokens**（colors / font / radius / spacing）→ 視覚層（Step 9）の評価基準
  - **Context**（ターゲット・トンマナ）→ 体験層・コンテンツ層の評価・改善提案に反映
  - **NG Rules** → ガイドライン違反を自動検出してギャップとして報告
- **見つからない場合**: ガイドラインなしで続行（一般的なベストプラクティスを評価基準とする）

---

### Phase 1: 解析フェーズ

**1-1. フレームワークの読み込み**
`~/.claude/skills/ui_shared/ui_framework.md` を読み込み、8層20ステップの構造と depth 定義を把握する。

**1-2. 対象情報の収集**
`target` の種類に応じて情報を取得する:

| targetの種類 | 取得方法 |
|-------------|---------|
| URL | `WebFetch` でページを取得・解析 |
| ファイルパス | `Read` でコードを読み込む |
| サービス名 | `WebSearch` で仕様・スクリーンショットを調査 |
| 画像（スクリーンショット） | 画像から視覚的にUIを解析 |

`context` に追加ファイル・URLが指定されている場合は合わせて読み込む。
情報が不足している場合は `AskUserQuestion` でユーザーに確認する。

**1-3. 仕様の抽出**
収集した情報から UIの仕様を抽出し、ui_framework.md の「8層20ステップ」にマッピングする:
- `step` が指定されている場合は該当ステップのみ
- `step` が未指定の場合は全20ステップをマッピング

**1-4. ファイル保存**
クライアントフォルダが存在する場合は `clients/[クライアント名]/generate/02_specs/[target]/` に、存在しない場合は `ui-specs/[target]/` に保存する:
```
clients/[クライアント名]/generate/02_specs/[target]/summary.md
clients/[クライアント名]/generate/02_specs/[target]/[target]_[step-name].md
```
`summary.md` を作成し、全ステップへのリンクと進捗を記録する。

---

### Phase 2: マッピングと仕様化フェーズ

抽出した仕様を設計フレームワークの構造に沿って Markdown で出力する。

**既存コードがある場合の追加手順:**
1. ファイル構成・データ構造を読み込む
2. 設計フレームワークの構造に沿って解析結果をまとめる
3. **ギャップ分析**: 既存実装に不足・不整合・改善余地がある箇所を洗い出す

出力フォーマット（depth=standard の例）:
```markdown
## [8. Permission & Access Control]
### 現状の実装
- ...
### ギャップ・課題
- ...（mode=propose の場合のみ）
```

---

### Phase 3: 改善提案（mode=propose の場合のみ）

現状の実装とベストプラクティス（または Baseline）を比較し、
各ステップの改善案・アクションプランを提示する:

```markdown
### 改善提案
| 優先度 | 課題 | 改善案 | 工数感 |
|--------|------|--------|--------|
| 🔴 High | ... | ... | S/M/L |
| 🟡 Mid  | ... | ... | S/M/L |
| 🟢 Low  | ... | ... | S/M/L |
```

---

## Baseline（オプション）

ユーザーが「Baseline は [サービス名]」と指定した場合:
1. `WebSearch` で対象サービスの仕様・UIを調査する
2. `target` と比較し、優れている点・不足している点を洗い出す
3. 設計フレームワークの各ステップに沿って具体的な改善提案を行う

指定がない場合は一般的なベストプラクティスを基準とする。

---

## 実行例

```
/ui-spec target="https://example.com/search" depth=quick

/ui-spec target="app/components/Header.tsx" depth=standard

/ui-spec target="app/components/Dashboard.tsx" mode=propose

/ui-spec target="app/components/Dashboard.tsx" depth=standard step="Microcopy"

/ui-spec target="現在の検索UI" context="url: https://example.com/search, code: app/components/Search.tsx" depth=exhaustive

/ui-spec target="Shopify Theme Editor" mode=propose depth=exhaustive

/ui-spec target="app/components/Dashboard.tsx" depth=exhaustive
  context="file: app/types/dashboard.ts, url: https://example.com/api/dashboard"
  gap-summary="クリティカルなIssueを中心に改善案を提案"
```

<!-- TODO: context パラメータの gap-summary など拡張キーの定義を追記 -->
