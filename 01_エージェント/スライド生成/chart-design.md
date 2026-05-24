# グラフ構成データ作成ルール（CHART_DESIGN）

> このファイルは `generate-sales-deck` スキルの Step 4 で、グラフが必要な場合にのみ読み込まれる。
> `imageText` パターンの `image` フィールドに、以下のJSONオブジェクトを入力する。

---

## JSON作成時の最重要ルール（全グラフ共通）

1. **ダブルクォーテーション**: キーと文字列値は必ず `"` で囲む。数値・bool は囲まない。
2. **Trailing Comma 禁止**: オブジェクト/配列の最後の要素の後にカンマを入れない。
3. **括弧の対応**: `{` → `}`, `[` → `]` を必ず閉じる。
4. **構造改変禁止**: JSON設定ガイドに記載がない方法で構造を改変しない。
5. **色の変更**: 指示がない限りデフォルトカラーを使用。

---

## 1. 折れ線グラフ（複数系列） — `"chartType": "multi-line"`

```json
{
  "chartType": "multi-line",
  "data": {
    "title": "データ系列の比較",
    "subtitle": "（年間サンプルデータ）",
    "source": "出典：サンプルデータ",
    "yAxisUnitLabel": "（単位）",
    "xAxisLabels": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    "series": [
      { "id": "A", "label": "系列A", "values": [10, 12, 15, 20, 24, 27, 29, 28, 25, 20, 16, 12] },
      { "id": "B", "label": "系列B", "values": [7, 8, 11, 15, 18, 20, 21, 20, 16, 13, 10, 8] }
    ],
    "colors": [
      { "id": "A", "start": "#e68a9c", "end": "#d96d8f" },
      { "id": "B", "start": "#b469b8", "end": "#a656ad" }
    ],
    "layout": {
      "width": 650, "height": 510,
      "marginTop": 140, "marginBottom": 80, "marginLeft": 75, "marginRight": 35,
      "horizontalPadding": 20
    },
    "yAxis": { "min": 0, "max": 30, "tickCount": 6 },
    "lineOptions": { "markerRadius": 5, "dataLabelOffsetY": 8 }
  }
}
```

**注意**: `xAxisLabels` の要素数 = 全 `series[].values` の要素数。`series[].id` と `colors[].id` を対応させる。

---

## 2. ドーナツグラフ — `"chartType": "donut"`

```json
{
  "chartType": "donut",
  "data": {
    "title": "グラフタイトル",
    "subtitle": "グラフサブタイトル",
    "source": "出典: データソース",
    "centerLabel": "合計ラベル",
    "colors": [
      { "id": "A", "start": "#e68a9c", "end": "#d96d8f" },
      { "id": "B", "start": "#b469b8", "end": "#a656ad" },
      { "id": "C", "start": "#9f63d0", "end": "#8c4fc8" }
    ],
    "items": [
      { "label": "項目 A", "value": 40, "id": "A" },
      { "label": "項目 B", "value": 25, "id": "B" },
      { "label": "項目 C", "value": 35, "id": "C" }
    ]
  }
}
```

**注意**: `items[].id` と `colors[].id` を対応させる。中央の合計値は自動計算。

---

## 3. 絶対値積み上げ棒グラフ — `"chartType": "stacked-bar"`

```json
{
  "chartType": "stacked-bar",
  "data": {
    "title": "カテゴリ別数量",
    "subtitle": "（月別データ）",
    "source": "出典：データソース",
    "yAxisUnitLabel": "（単位）",
    "colors": [
      { "id": "A", "start": "#e68a9c", "end": "#d96d8f" },
      { "id": "B", "start": "#b469b8", "end": "#a656ad" },
      { "id": "C", "start": "#7c6ce8", "end": "#6b5ce0" }
    ],
    "legendLabels": ["項目 A", "項目 B", "項目 C"],
    "barData": [
      { "label": "Q1", "values": [60, 50, 40] },
      { "label": "Q2", "values": [90, 60, 50] },
      { "label": "Q3", "values": [60, 80, 70] }
    ],
    "layout": {
      "width": 600, "height": 550,
      "marginTop": 170, "marginBottom": 50, "marginLeft": 75, "marginRight": 50
    },
    "barOptions": { "width": 50, "cornerRadius": 4, "totalLabelOffset": 10 },
    "yAxis": { "max": 300, "tickCount": 3 }
  }
}
```

**注意**: `colors` / `legendLabels` / `barData[].values` の要素数を一致させる。`yAxis.max` は最大合計値より大きく設定。

---

## 4. 100%積み上げ棒グラフ — `"chartType": "100-stacked-bar"`

```json
{
  "chartType": "100-stacked-bar",
  "data": {
    "title": "カテゴリ別割合",
    "subtitle": "（月別データ）",
    "source": "出典：データソース",
    "colors": [
      { "id": "A", "start": "#e68a9c", "end": "#d96d8f" },
      { "id": "B", "start": "#b469b8", "end": "#a656ad" },
      { "id": "C", "start": "#7c6ce8", "end": "#6b5ce0" }
    ],
    "legendLabels": ["項目 A", "項目 B", "項目 C"],
    "barData": [
      { "label": "Q1", "values": [40, 60, 30] },
      { "label": "Q2", "values": [70, 50, 40] }
    ],
    "layout": {
      "width": 600, "height": 510,
      "marginTop": 150, "marginBottom": 80, "marginLeft": 70, "marginRight": 25
    },
    "barOptions": { "width": 50, "cornerRadius": 4 },
    "yAxis": { "tickCount": 4 }
  }
}
```

**注意**: values は自動的に割合に変換。0以上の値のみ。

---

## 5. 棒グラフ（単一系列） — `"chartType": "bar"`

```json
{
  "chartType": "bar",
  "data": {
    "title": "サンプル棒グラフ",
    "subtitle": "動的レイアウト",
    "source": "出典：データソース",
    "items": [
      { "label": "項目A", "value": 85 },
      { "label": "項目B", "value": 72 },
      { "label": "項目C", "value": 93 }
    ],
    "color": { "start": "#e68a9c", "end": "#9f63d0" },
    "layout": {
      "width": 600, "height": 450,
      "marginTop": 100, "marginBottom": 65, "marginLeft": 70, "marginRight": 40
    },
    "barOptions": { "barToSlotRatio": 0.6 },
    "yAxis": { "max": 100, "min": 0, "tickCount": 4, "unit": "%" }
  }
}
```

**注意**: `label` に `...` + `value` を 0 にすると省略表現が可能（上位/下位n件表示）。

---

## 6. 複合グラフ（折れ線＋棒） — `"chartType": "combo"`

```json
{
  "chartType": "combo",
  "data": {
    "title": "複合グラフ",
    "subtitle": "（系列比較）",
    "source": "出典：データソース",
    "legendBarLabel": "系列 A",
    "legendLineLabel": "系列 B",
    "yAxisLeftLabel": "（数量）",
    "yAxisRightLabel": "（割合）",
    "colors": {
      "bar": { "start": "#e68a9c", "end": "#b469b8" },
      "line": "#6b5ce0"
    },
    "items": [
      { "label": "Q1", "barValue": 245, "lineValue": 16 },
      { "label": "Q2", "barValue": 270, "lineValue": 19 },
      { "label": "Q3", "barValue": 310, "lineValue": 21 }
    ],
    "layout": {
      "width": 600, "height": 510,
      "marginTop": 180, "marginBottom": 50, "marginLeft": 70, "marginRight": 70
    },
    "barOptions": { "barToSlotRatio": 0.55, "labelPosition": "auto" },
    "lineOptions": { "markerRadius": 5 },
    "yAxisLeft": { "max": 400, "min": 0, "tickCount": 4 },
    "yAxisRight": { "max": 25, "min": 15, "tickCount": 4, "unit": "%" }
  }
}
```

**注意**: 各 `items` に `label`, `barValue`, `lineValue` の3つをセット。2つのY軸を適切に設定。

---

## 7. 折れ線グラフ（単一系列） — `"chartType": "line"`

```json
{
  "chartType": "line",
  "data": {
    "title": "年間データ推移",
    "subtitle": "（サンプル）",
    "source": "出典：データソース",
    "yAxisUnitLabel": "（単位）",
    "items": [
      { "label": "1月", "value": 8 },
      { "label": "2月", "value": 9 },
      { "label": "3月", "value": 12 }
    ],
    "color": {
      "start": "#e68a9c", "end": "#b469b8",
      "line": "#b469b8", "label": "#8c4fc8"
    },
    "layout": {
      "width": 600, "height": 465,
      "marginTop": 100, "marginBottom": 85, "marginLeft": 75, "marginRight": 25
    },
    "yAxis": { "max": 40, "min": 0, "tickCount": 4 },
    "lineOptions": { "markerRadius": 5, "dataLabelOffsetY": 15, "horizontalPadding": 30 }
  }
}
```

**注意**: `yAxis.max` は最大 `value` より大きく設定。
