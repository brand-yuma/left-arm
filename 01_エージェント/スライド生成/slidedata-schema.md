# slideData スキーマ定義・構成ルール・検証チェックリスト

> このファイルは `generate-sales-deck` スキルの Step 4 で読み込まれる。
> slideData 生成時に以下のすべてのルールを厳守すること。

---

## 1. slideData スキーマ定義

### 共通プロパティ

- **notes?: string** — すべてのスライドオブジェクトに任意で追加可能。**完全なプレーンテキスト**。`**太字**` `[[強調語]]` 等のマークアップ記法は**絶対禁止**。
- **重要**: すべてのスライドタイプの `title` フィールドには強調語 `[[ ]]` を**使用しないこと**。

### 構造スライド

- **タイトル**: `{ "type": "title", "title": "...", "date": "YYYY.MM.DD", "notes": "..." }`
- **章扉**: `{ "type": "section", "title": "...", "sectionNo": number, "notes": "..." }` ※sectionNo 省略時は自動連番
- **クロージング**: `{ "type": "closing", "notes": "..." }`

### 本文パターン（30種以上）

#### 汎用パターン（全体の30%以下に制限）

- **content**（1カラム/2カラム＋小見出し）
  `{ "type": "content", "title": "...", "subhead?": "...", "points?": ["..."], "twoColumn?": bool, "columns?": [["..."], ["..."]], "notes": "..." }`

- **cards**（シンプルカード、最大6項目 3列x2行）
  `{ "type": "cards", "title": "...", "subhead?": "...", "columns?": 2|3, "items": ["..." | { "title": "...", "desc?": "..." }], "notes": "..." }`

- **headerCards**（ヘッダー付きカード、最大6項目 3列x2行）
  ヘッダー部は白文字。強調語は `[[]]` ではなくヘッダー文字列として渡す。
  `{ "type": "headerCards", "title": "...", "subhead?": "...", "columns?": 2|3, "items": [{ "title": "...", "desc?": "..." }], "notes": "..." }`

- **table**（表）
  `{ "type": "table", "title": "...", "subhead?": "...", "headers": ["..."], "rows": [["..."]], "notes": "..." }`

- **bulletCards**（箇条書きカード、最大3項目）
  `{ "type": "bulletCards", "title": "...", "subhead?": "...", "items": [{ "title": "...", "desc": "..." }], "notes": "..." }`

#### 専門パターン（積極的に活用すること）

- **agenda**（アジェンダ）番号ボックス形式。**本文に数字を含めない**。
  `{ "type": "agenda", "title": "...", "subhead?": "...", "items": ["..."], "notes": "..." }`

- **compare**（対比）
  `{ "type": "compare", "title": "...", "subhead?": "...", "leftTitle": "...", "rightTitle": "...", "leftItems": ["..."], "rightItems": ["..."], "notes": "..." }`

- **process**（手順・工程、最大4ステップ視覚形式）
  `{ "type": "process", "title": "...", "subhead?": "...", "steps": ["..."], "notes": "..." }`

- **processList**（手順リスト形式）
  `{ "type": "processList", "title": "...", "subhead?": "...", "steps": ["..."], "notes": "..." }`

- **timeline**（時系列）`milestones.label` は30文字以内。
  `{ "type": "timeline", "title": "...", "subhead?": "...", "milestones": [{ "label": "...", "date": "...", "state?": "done"|"next"|"todo" }], "notes": "..." }`

- **diagram**（レーン図）
  `{ "type": "diagram", "title": "...", "subhead?": "...", "lanes": [{ "title": "...", "items": ["..."] }], "notes": "..." }`

- **cycle**（サイクル図、4項目固定、1項目20文字程度推奨）
  `{ "type": "cycle", "title": "...", "subhead?": "...", "items": [{ "label": "...", "subLabel?": "..." }], "centerText?": "...", "notes": "..." }`

- **progress**（進捗、最大5項目）
  `{ "type": "progress", "title": "...", "subhead?": "...", "items": [{ "label": "...", "percent": number }], "notes": "..." }`

- **quote**（引用）
  `{ "type": "quote", "title": "...", "subhead?": "...", "text": "...", "author": "...", "notes": "..." }`

- **kpi**（KPIカード、2〜4項目推奨）
  `{ "type": "kpi", "title": "...", "subhead?": "...", "columns?": 2|3|4, "items": [{ "label": "...", "value": "...", "change": "...", "status": "good"|"bad"|"neutral" }], "notes": "..." }`

- **faq**（よくある質問、1〜4項目）`q` 全角28文字以内、`a` 全角45文字以内。
  `{ "type": "faq", "title": "...", "subhead?": "...", "items": [{ "q": "...", "a": "..." }], "notes": "..." }`

- **statsCompare**（数値比較テーブル形式）`label` 全角12文字以内。
  `{ "type": "statsCompare", "title": "...", "subhead?": "...", "leftTitle": "...", "rightTitle": "...", "stats": [{ "label": "...", "leftValue": "...", "rightValue": "...", "trend?": "up"|"down"|"neutral" }], "notes": "..." }`

- **barCompare**（棒グラフ比較）`label` 全角12文字以内。`showTrends` デフォルト false。
  `{ "type": "barCompare", "title": "...", "subhead?": "...", "stats": [{ "label": "...", "leftValue": "...", "rightValue": "...", "trend?": "up"|"down"|"neutral" }], "showTrends?": bool, "notes": "..." }`

- **triangle**（トライアングル図、3項目固定）`title` 10-12文字以内、`desc` 15文字以内。
  `{ "type": "triangle", "title": "...", "subhead?": "...", "items": [{ "title": "...", "desc?": "..." }], "notes": "..." }`

- **pyramid**（ピラミッド図、3〜4段階）
  `{ "type": "pyramid", "title": "...", "subhead?": "...", "levels": [{ "title": "...", "description": "..." }], "notes": "..." }`

- **flowChart**（フローチャート、1〜2行、1行最大4個、合計最大8個）
  `{ "type": "flowChart", "title": "...", "subhead?": "...", "flows": [{ "steps": ["..."] }], "notes": "..." }`

- **stepUp**（ステップアップ、2〜5ステップ）`title` 全角10文字以内、`desc` 全角28文字以内。
  `{ "type": "stepUp", "title": "...", "subhead?": "...", "items": [{ "title": "...", "desc": "..." }], "notes": "..." }`

- **imageText**（画像テキスト）画像URLが**明示的に提供されている場合のみ**使用。
  `{ "type": "imageText", "title": "...", "subhead?": "...", "image": "URL or 説明文", "imageCaption?": "...", "imagePosition?": "left"|"right", "points": ["..."], "notes": "..." }`

---

## 2. 構成ルール（COMPOSITION_RULES）

### 全体構成
1. `title`（表紙）
2. `agenda`（アジェンダ） ※章が **2つ以上** のときのみ
3. `section`（章扉） ※ユーザーが「不要」と回答した場合は生成しない
4. 本文（専門パターン優先、汎用パターン補完、**2〜5枚**、多様性重視）
5. （3〜4を章の数だけ繰り返し）
6. `closing`（結び）

### パターン選定の優先ルール

**【最優先】専門パターンの積極活用**
1. アジェンダ・目次 → `agenda`
2. 数値・データ → `statsCompare` / `barCompare` / `kpi` / `progress` / SVGグラフ
3. 時系列・手順 → `timeline` / `process` / `processList` / `flowChart`
4. 比較・対比 → `compare` / `statsCompare` / `barCompare`
5. 階層・構造 → `pyramid` / `stepUp` / `triangle`
6. 循環・関係性 → `cycle` / `triangle` / `diagram`
7. Q&A → `faq`
8. 引用・証言 → `quote`

**【制限】汎用パターン**
- `content`: 全体の **30%以下** に制限
- `cards`: 専門パターンで表現できない場合のみ

**【必須】多様性**
- 1プレゼンで **最低5種類** の異なるパターン
- 同一パターンの連続使用禁止

### テキスト表現・字数（最大目安）

| 要素 | 上限 |
|------|------|
| `title.title` | 全角35文字以内 |
| `title.date` | YYYY.MM.DD 形式 |
| `section.title` | 全角30文字以内 |
| 各パターンの `title` | 全角40文字以内 |
| `subhead` | 全角50文字以内（最大2行） |
| 箇条書き等の要素テキスト | 各90文字以内・**改行禁止** |
| `faq` の `q` | 全角28文字以内 |
| `faq` の `a` | 全角45文字以内 |
| `stepUp` の `items.title` | 全角10文字以内 |
| `stepUp` の `items.desc` | 全角28文字以内 |
| `barCompare`/`statsCompare`/`compare` の `label` | 全角12文字以内 |
| `triangle` の `items.title` | 10-12文字以内 |
| `triangle` の `items.desc` | 15文字以内 |
| `timeline` の `milestones.label` | 30文字以内 |
| `cycle` | 1項目あたり20文字程度 |

### インライン強調記法
- `**太字**` → 太字（全領域で使用可能）
- `[[重要語]]` → 太字＋プライマリカラー
  - **使用可能**: `points`, `leftItems`, `rightItems`, `steps`, `milestones.label`, `items.desc`, `items.q`, `items.a` 等の本文カラム
  - **使用禁止**: `title`, `subhead`, `items.title`, `headers`, `leftTitle`, `rightTitle`, `centerText` 等のヘッダー要素

### 禁止事項
- テキスト内に **→** を含めない（矢印はスクリプトが描画）
- 箇条書き要素に **改行（\n）を含めない**
- 箇条書き文末に **句点「。」を付けない**（体言止め推奨）

### 画像使用の厳格なルール
- `https://` or `http://` で始まる画像URLが**明示的にテキスト内にある場合のみ** `imageText` を使用
- 「○○の画像」「写真を追加」等の指示があっても、具体的URLがなければ画像なしパターンを選択
- **AI自身による画像の検索・取得・生成・推定は一切禁止**
- グラフが必要な場合は `chart-design.md` を読み込み、JSONオブジェクトとして入力

---

## 3. 重複装飾サニタイザー（DUPLICATE-DECORATION SANITIZER）

### A. 先頭禁止トークン（全パターン共通）
- 先頭が句読点（`、`/`。`）で始まる文 → 削除

### B. 自動番号と重複する接頭辞の完全排除

以下のタイプでは **番号・段階を示す接頭辞を本文に含めない**:

| スライドタイプ | 禁止される先頭表現 |
|----------------|-------------------|
| `process`, `processList`, `flowChart`, `stepUp` | `1.` / `①` / `Step 1` / `STEP 1` / `ステップ1` / `第1段階` 等 |
| `agenda` | `1.` / `①` / `(1)` / `その1` / `第一章` 等 |
| `timeline` | `1.` / `①` / `(Phase 1)` / `フェーズ1:` 等 |

### C. 冗長ラベルの排除
- 比較系（`compare`, `statsCompare`, `barCompare`）で左/右タイトルに「メリット」「デメリット」等を置く場合、各アイテム内に同ラベルを**繰り返さない**

### D. 語尾と句読点
- 箇条書きは終端の「。」禁止（体言止め推奨）
- `、`で終わっていたら削除

---

## 4. 検証チェックリスト（生成後に必ず実行）

- [ ] すべての `title` フィールドに強調語 `[[ ]]` が含まれていない
- [ ] すべての `subhead`, `items.title`, `headers`, `leftTitle`, `rightTitle`, `centerText` に `[[ ]]` が含まれていない
- [ ] `notes` にマークアップ記法（`**`, `[[`, `]]`）が含まれていない
- [ ] `process`/`processList`/`flowChart`/`stepUp`/`agenda`/`timeline` の項目に番号・STEP・丸数字が入っていない
- [ ] `compare` 系で列見出しと同じラベルをアイテム先頭に繰り返していない
- [ ] 行頭が `、` `。` で始まっていない
- [ ] 箇条書き要素に改行（\n）を含めていない
- [ ] テキスト内に禁止記号（→）を含めていない
- [ ] 箇条書き文末に句点「。」が付いていない
- [ ] 文字数上限を遵守（各パターンの規定に従う）
- [ ] `title.date` は YYYY.MM.DD 形式
- [ ] `agenda` の `items` が空でない（最低3点）
- [ ] 1プレゼンで最低5種類の異なるパターンを使用
- [ ] `content` パターンが全体の30%以下
- [ ] ブランドガイドラインの NG Rules に抵触する表現がない

---

## 5. 安全ガイドライン

- スライド上限: **最大50枚**
- 画像制約: **50MB未満・25MP以下** の **PNG/JPEG/GIF/WebP**
- 実行時間: Apps Script 全体で約 **6分**
- フォント: Arial が無い環境では標準サンセリフに自動フォールバック
- 文字列値にダブルクォートを含める場合は `\"` でエスケープ

---

## 6. 出力形式

- 出力は **`slideData` 配列そのもの**（JSON形式）
- `const slideData =` 等の変数宣言は含めない
- キーと文字列値の両方をダブルクォーテーション（`"`）で囲む
- 単一のコードブロック（` ```json ... ``` `）に格納
- **コードブロック以外のテキストは一切含めない**
