# Layout Rules — generate-banner スキル用 外部レイアウト定義

このファイルは `generate-banner` スキルの STEP 3（段階的開示）で読み込まれる。
メインプロンプトのコンテキスト汚染を防ぐため、レイアウト原則をここに集約する。

---

## 1. 視線誘導モデル

### バナーサイズ別に適用するモデル

| サイズ | 推奨モデル | 理由 |
|---|---|---|
| 1080×1080（正方形） | **Z型** | 全体が見渡しやすく、CTAが右下に自然に収まる |
| 1080×1920（縦型） | **F型** | 縦スクロール習慣に合わせた左起点の視線誘導 |
| 1200×628（横長） | **Z型** | 横長はZ型が最も自然な視線移動を生む |
| 390×844（スマホ縦型） | **F型** | 片手操作を想定。左側に重要情報を集中させる |

### Z型レイアウトの配置ルール
```
[ロゴ/ブランド名] ───────────── [サブコピー/季節感]
        ↓ (対角線)
[キービジュアル/大見出し]
        ↓ (対角線)
[ベネフィットリスト] ─────────── [CTAボタン]
```

### F型レイアウトの配置ルール
```
[ロゴ/ブランド名] ────────────────────────
[バッジ/シーズナル訴求]
[大見出し]
[サブコピー（共感）]
────────────────────────────────────────
[ベネフィット 1]
[ベネフィット 2]
[ベネフィット 3]
────────────────────────────────────────
[希少性コピー]
[CTAボタン（横幅100%）]
[注記テキスト]
```

---

## 2. AIBAC フレームワーク

各要素に対して以下の役割を1対1で割り当てること。

| 層 | 役割 | 実装要素 | 注意 |
|---|---|---|---|
| **A**ttention | 視覚的に止める | バッジ・季節感テキスト・大見出し | フォントサイズ最大。colors.main または colors.accent 使用 |
| **I**nterest | 共感・引き込み | サブコピー（課題への言及） | colors.subtext。1〜2行に留める |
| **B**enefit | 具体的メリット | ベネフィットリスト（3項目推奨） | SVGチェックアイコン + 短文。箇条書き |
| **A**ction | 行動喚起 | CTAボタン | colors.accent 背景。ピル形状（radius.button） |
| **C**redibility | 信頼補強 | 限定数・締切・注記 | 小文字。colors.subtext。CTAの直前または直後 |

---

## 3. コンポーネント構造（Flexbox必須）

### ルート構造
```html
<div data-layer="BannerRoot" style="display:flex; flex-direction:column; width:[W]px; background:var(--color-base);">

  <div data-layer="HeaderBar" style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; background:var(--color-main); padding:16px 24px;">
    <!-- ロゴ + シーズンラベル -->
  </div>

  <div data-layer="HeroImage" style="display:flex; align-items:center; justify-content:center; height:[H/3]px; background:#D9D0C8;">
    <!-- Base64 img タグ -->
  </div>

  <div data-layer="ContentArea" style="display:flex; flex-direction:column; gap:24px; padding:32px 24px 40px;">

    <div data-layer="AttentionBadge" style="display:inline-flex; align-items:center; gap:6px; align-self:flex-start; background:var(--color-accent); color:#fff; border-radius:9999px; padding:6px 14px; font-size:11px; letter-spacing:0.1em;">
      <!-- Attention -->
    </div>

    <div data-layer="HeadlineBlock" style="display:flex; flex-direction:column; gap:8px;">
      <!-- Interest + Benefit① -->
    </div>

    <div data-layer="Divider" style="height:1px; background:rgba(0,0,0,0.1);"></div>

    <div data-layer="BenefitList" style="display:flex; flex-direction:column; gap:12px;">
      <!-- Benefit② × 3items -->
    </div>

    <div data-layer="CTASection" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
      <!-- Credibility + Action -->
    </div>

  </div>

  <div data-layer="FooterStrip" style="display:flex; align-items:center; justify-content:center; background:var(--color-main); padding:12px 24px;">
    <!-- ブランド名 -->
  </div>

</div>
```

---

## 4. タイポグラフィ スケール

8px単位ルールに準拠したフォントサイズ体系。

| 役割 | サイズ | ウェイト | フォント |
|---|---|---|---|
| 大見出し（H1） | 32〜40px | 600 | font.heading |
| 中見出し（H2） | 20〜24px | 600 | font.heading |
| バッジ/ラベル | 11〜12px | 700 | font.body |
| 本文 | 13〜15px | 400〜500 | font.body |
| キャプション | 11px | 400 | font.body |

---

## 5. ABテスト設計ガイドライン

バナーを疎に設計し、以下の変数を独立して変更できるようにすること。

### 推奨ABテスト変数（優先順）
1. **CTAボタンのコピー文言** — 仮説: 「予約する」より「体験してみる」が柔らかく離脱率低下
2. **希少性の数字** — 仮説: 「先着10名」より「先着5名」が希少性を強調
3. **大見出しの訴求軸** — 課題共感型 vs. ベネフィット直球型
4. **CTAボタンカラー** — colors.accent vs. colors.main
5. **HeroImageの有無** — 画像あり vs. コピーのみのシンプル版

### 設計上の注意
- 1回のテストで変更する変数は必ず1つのみ
- 各コンポーネントは `data-layer` 属性で独立したブロックとして識別できるようにする
- Figmaでのバリアント作成を想定し、コンポーネント間の依存関係を最小化する

---

## 6. アクセシビリティ チェックリスト

バナー生成後、以下を必ず確認すること。

- [ ] colors.text × colors.base のコントラスト比 ≥ 4.5:1（WCAG AA）
- [ ] colors.accent × colors.base のコントラスト比 ≥ 4.5:1（WCAG AA）
- [ ] CTAボタン内テキスト（白）× colors.accent のコントラスト比 ≥ 4.5:1
- [ ] すべてのフォントサイズ ≥ 11px
- [ ] 情報の伝達が色のみに依存していないこと（アイコン or テキストで補完）
