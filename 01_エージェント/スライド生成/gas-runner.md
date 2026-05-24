# まじん式 Slide Generator — Runner Template

> このファイルは `generate-sales-deck` スキルの Step 6-3 で使用するGAS実行コードテンプレート。
> **前提**: まじん式 Google Slide Generator（コード.gs）が同一GASプロジェクトに存在すること。

---

## 使い方

1. Google スライドを新規作成 → **拡張機能 → Apps Script** を開く
2. まじん式の `コード.gs` を貼り付け（未導入の場合）
3. 新規スクリプトファイルを作成し、出力コードを丸ごと貼り付け
4. `generateSlides` 関数を選択して「実行」
5. 生成されたスライドで画像挿入・最終調整を実施

---

## Runner コード テンプレート（GAS）

```javascript
// ============================================================
// slideData: AI が生成した JSON 配列
// ============================================================
const slideData = [
  /* ここにAIが生成したJSON配列を埋め込む */
];

// ============================================================
// SLIDE_SETTINGS: ブランドガイドラインに合わせて設定
// ============================================================
const SLIDE_SETTINGS = {
  primaryColor: '#4285F4',        // プライマリカラー（HEX）
  largeFontColor: '#333333',      // 大見出しフォントカラー
  smallFontColor: '#1F2937',      // 小見出しフォントカラー
  backgroundColor: '#FFFFFF',     // 背景色
  fontFamily: 'Noto Sans JP',     // フォントファミリー
  showTitleUnderline: true,       // タイトル下線を表示
  showBottomBar: true,            // 下部バーを表示
  showDateColumn: true,           // 日付を表示
  showPageNumber: true,           // ページ番号を表示
  enableGradient: false,          // グラデーション有効化
  gradientStart: '#4285F4',       // グラデーション開始色
  gradientEnd: '#ff52df',         // グラデーション終了色
  footerText: '© Your Company',  // フッターテキスト
  headerLogoUrl: '',              // ヘッダーロゴ URL（空欄可）
  closingLogoUrl: '',             // クロージングロゴ URL（空欄可）
  titleBgUrl: '',                 // タイトル背景画像 URL
  sectionBgUrl: '',               // セクション背景画像 URL
  mainBgUrl: '',                  // 本文背景画像 URL
  closingBgUrl: '',               // クロージング背景画像 URL
  driveFolderUrl: '',             // 保存先 Google Drive フォルダ URL
  graphColorTheme: 'primary',     // グラフカラーテーマ
};

// ============================================================
// generateSlides: この関数を実行してスライドを生成
// ============================================================
function generateSlides() {
  // まじん式の loadSettings() が存在する場合はそちらを優先
  const settings = (typeof loadSettings === 'function')
    ? loadSettings()
    : SLIDE_SETTINGS;

  const url = generateSlidesFromWebApp(JSON.stringify(slideData), settings);
  Logger.log('生成完了: ' + url);

  try {
    Browser.msgBox('スライドを生成しました！\n\n' + url);
  } catch (e) {
    Logger.log('完了（msgBox非対応環境）: ' + url);
  }
}
```

---

## ブランドカラー設定早見表

| クライアント | primaryColor | fontFamily |
|---|---|---|
| Natura Skin | `#5C7C66`（アースグリーン） | `Noto Serif JP` |
| デフォルト | `#4285F4`（Google Blue） | `Noto Sans JP` |

---

## slideGenerators 対応タイプ一覧

> まじん式コード.gs の `slideGenerators` オブジェクトが対応するタイプ。
> slidedata-schema.md のスキーマと対応している。

| タイプ | GAS関数 |
|---|---|
| `title` | createTitleSlide |
| `section` | createSectionSlide |
| `closing` | createClosingSlide |
| `content` | createContentSlide |
| `agenda` | createAgendaSlide |
| `compare` | createCompareSlide |
| `process` | createProcessSlide |
| `processList` | createProcessListSlide |
| `timeline` | createTimelineSlide |
| `diagram` | createDiagramSlide |
| `cycle` | createCycleSlide |
| `cards` | createCardsSlide |
| `headerCards` | createHeaderCardsSlide |
| `table` | createTableSlide |
| `progress` | createProgressSlide |
| `quote` | createQuoteSlide |
| `kpi` | createKpiSlide |
| `bulletCards` | createBulletCardsSlide |
| `faq` | createFaqSlide |
| `statsCompare` | createStatsCompareSlide |
| `barCompare` | createBarCompareSlide |
| `triangle` | createTriangleSlide |
| `pyramid` | createPyramidSlide |
| `flowChart` | createFlowChartSlide |
| `stepUp` | createStepUpSlide |
| `imageText` | createImageTextSlide |
