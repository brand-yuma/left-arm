# 画像アセットカタログ — generate-sales-deck

> このファイルは `generate-sales-deck` スキルの Step 4 で読み込まれる。
> slideData 生成時に、資料の内容・ターゲット業種に応じて適切な画像を選択し
> `SLIDE_SETTINGS` の背景URL、または `imageText` スライドの `image` フィールドに埋め込む。

---

## 使い方

### SLIDE_SETTINGS での使用（背景画像）

```javascript
const SLIDE_SETTINGS = {
  titleBgUrl:   '画像のURL or Drive ファイルID',  // 表紙背景
  sectionBgUrl: '',                               // 章扉背景（空欄=primaryColor全面）
  mainBgUrl:    '',                               // 本文背景（空欄推奨）
  closingBgUrl: '',                               // クロージング背景
  headerLogoUrl:  '画像URL or Drive ファイルID',  // ヘッダーロゴ
  closingLogoUrl: '画像URL or Drive ファイルID',  // クロージングロゴ
};
```

### imageText スライドでの使用

```json
{ "type": "imageText", "image": "Drive ファイルID or https://... URL", ... }
```

---

## 画像選択ルール

1. `titleBgUrl` は **必ず設定する**（画像があれば）— 表紙の第一印象に直結
2. `sectionBgUrl` は **空欄推奨**（改修済みのprimaryColor全面デザインを活かす）
3. `imageText` は **明示的にURLが提供されている場合のみ** 使用（スキーマルール準拠）
4. 複数の候補がある場合は、**ターゲット業種・章の内容**に最も合うものを選ぶ
5. ロゴ画像（ashiraku-logo2.webp）は `headerLogoUrl` / `closingLogoUrl` に使用する
6. TVメディア露出（スクリーンショット）は `imageText` スライドのエビデンス章でのみ使用

---

## Drive フォルダ設定

- **フォルダID**: `1ysb1Vegl4ia18pHTE0MtRnWOcnIqb9-R`
- **フォルダパス**: マイドライブ/assets/sales-deck/（エイリアス）
- **共有設定**: フォルダを「リンクを知っている全員が閲覧可」に設定すること
- **Drive URL形式**: `https://drive.google.com/uc?id=【ファイルID】&export=download`
  - ファイルID: Drive で画像を開いたときの URL `https://drive.google.com/file/d/【ここ】/view`

---

## アセット一覧

### プロジェクト: 足楽（ひのき酵素風呂）

---

### ashiraku-logo2.webp
- Drive URL: https://drive.google.com/uc?id=1VsWuKDz0HkBimscv0HpJW6CKQ4fXky06&export=download
- Drive ファイルID: `1VsWuKDz0HkBimscv0HpJW6CKQ4fXky06`
- 用途: headerLogoUrl / closingLogoUrl
- タグ: [足楽] [ロゴ] [ブランド]
- 推奨スライド: SLIDE_SETTINGS の headerLogoUrl・closingLogoUrl に必ず設定

---

### AdobeStock_1142210683.jpeg ★表紙背景最有力
- Drive URL: https://drive.google.com/uc?id=1av9LHB0rYSHkM4WKMd7iN75fgc-V1IP7&export=download
- Drive ファイルID: `1av9LHB0rYSHkM4WKMd7iN75fgc-V1IP7`
- 内容: 女性が酵素浴槽（おがくず）の上に座り、くつろぎながら本を読んでいる（足楽の使用シーン）
- 用途: titleBgUrl
- タグ: [足楽] [酵素浴] [使用シーン] [女性] [リラックス] [プレミアム]
- 推奨スライド: タイトル表紙（痩身エステ向け・整体向け共通）

---

### AdobeStock_1570825176.jpeg
- Drive URL: https://drive.google.com/uc?id=1urRClVkZZodzWL61f0EfgdSY7xnX5Hui&export=download
- Drive ファイルID: `1urRClVkZZodzWL61f0EfgdSY7xnX5Hui`
- 内容: スタッフが酵素浴槽のおがくずを両手でならしているシーン（クローズアップ）
- 用途: imageText
- タグ: [足楽] [酵素浴] [スタッフ] [プロ] [準備] [ナチュラル]
- 推奨スライド: 「足楽とは」「導入・施術フロー」説明スライド

---

### AdobeStock_1279941339.jpeg
- Drive URL: https://drive.google.com/uc?id=1qiAb2ezt27w4JsIiYoURcxe6jE3Kq4ka&export=download
- Drive ファイルID: `1qiAb2ezt27w4JsIiYoURcxe6jE3Kq4ka`
- 内容: 複数人の手がおがくず（酵素粉）を持ち合っているシーン
- 用途: imageText
- タグ: [足楽] [酵素] [ナチュラル] [オーガニック] [チームワーク]
- 推奨スライド: 「素材・成分」「科学的エビデンス」章

---

### AdobeStock_273084234.jpeg
- Drive URL: https://drive.google.com/uc?id=1AIr7uq4wobfsMN8U4wm-Jbht80X2510t&export=download
- Drive ファイルID: `1AIr7uq4wobfsMN8U4wm-Jbht80X2510t`
- 内容: 若い日本人女性がソファでトイプードルを抱きくつろいでいる（明るい室内・ライフスタイル）
- 用途: titleBgUrl / imageText
- タグ: [ライフスタイル] [女性] [親しみやすい] [日常] [痩身エステ向け]
- 推奨スライド: 「ターゲット顧客像」「課題喚起」章（痩身エステ向け）

---

### AdobeStock_273084433.jpeg
- Drive URL: https://drive.google.com/uc?id=1msMBwtXlzt5nOw5I9stoaCuRmg0-QwFN&export=download
- Drive ファイルID: `1msMBwtXlzt5nOw5I9stoaCuRmg0-QwFN`
- 内容: 若い日本人女性がトイプードルを抱きながらスマートフォンを見ている（室内・ナチュラル）
- 用途: imageText
- タグ: [ライフスタイル] [女性] [スマートフォン] [日常] [痩身エステ向け]
- 推奨スライド: 「顧客の日常・悩み」「SNSマーケティング」章

---

### Gemini_Generated_Image_70j59070j59070j5.png
- Drive URL: https://drive.google.com/uc?id=1cSRhAJZ2rixIMYCpnkz7wqXA9rgbCeXI&export=download
- Drive ファイルID: `1cSRhAJZ2rixIMYCpnkz7wqXA9rgbCeXI`
- 内容: 野菜・食材の集合写真（カラフルな自然派イメージ）
- 用途: imageText
- タグ: [ナチュラル] [オーガニック] [健康] [食] [自然派]
- 推奨スライド: 「自然由来成分」「健康効果」章

---

### IMG_4593 2.JPG
- Drive URL: https://drive.google.com/uc?id=1k5R6y7acAQn9fAp4HdzZsTC2dWm4laXy&export=download
- Drive ファイルID: `1k5R6y7acAQn9fAp4HdzZsTC2dWm4laXy`
- 内容: 足楽の実際の使用シーン（リアル写真）
- 用途: imageText
- タグ: [足楽] [使用シーン] [リアル]
- 推奨スライド: 「使用シーン」「お客様の声」章

---

### IMG_4594 3.JPG（書籍表紙）
- Drive URL: https://drive.google.com/uc?id=1v737GMu3jFRTsu7Agul_Ifea5brTVh99&export=download
- Drive ファイルID: `1v737GMu3jFRTsu7Agul_Ifea5brTVh99`
- 内容: 書籍「酵素温活メソッド」（西澤正行 著）の表紙
- 用途: imageText
- タグ: [足楽] [書籍] [エビデンス] [専門家] [権威性]
- 推奨スライド: 「科学的エビデンス」「専門家監修」章

---

### IMG_4595 2.JPG
- Drive URL: https://drive.google.com/uc?id=1_CRdinGGIozQEZir8AvtEk_6g5Kr_Is9&export=download
- Drive ファイルID: `1_CRdinGGIozQEZir8AvtEk_6g5Kr_Is9`
- 内容: 足楽の製品・使用シーン写真
- 用途: imageText
- タグ: [足楽] [製品] [使用シーン]
- 推奨スライド: 「製品紹介」「導入事例」章

---

### IMG_4596 2.PNG
- Drive URL: https://drive.google.com/uc?id=1kfCpwsQpxOetvtT73CDEqNJ0B2KU_Rme&export=download
- Drive ファイルID: `1kfCpwsQpxOetvtT73CDEqNJ0B2KU_Rme`
- 内容: 足楽の製品・使用シーン写真
- 用途: imageText
- タグ: [足楽] [製品] [使用シーン]
- 推奨スライド: 「製品紹介」「導入事例」章

---

### IMG_4598 2.JPG
- Drive URL: https://drive.google.com/uc?id=1xMhg6Q5paiFUo00UAaX0mTZ9V7AyMUjx&export=download
- Drive ファイルID: `1xMhg6Q5paiFUo00UAaX0mTZ9V7AyMUjx`
- 内容: 足楽の使用シーン写真
- 用途: imageText
- タグ: [足楽] [使用シーン] [リアル]
- 推奨スライド: 「使用シーン」「顧客体験」章

---

### IMG_4599 2.JPG
- Drive URL: https://drive.google.com/uc?id=1neL7MAht6LWaNY7xLEuOk2R84GkfDVCB&export=download
- Drive ファイルID: `1neL7MAht6LWaNY7xLEuOk2R84GkfDVCB`
- 内容: 足楽の使用シーン写真
- 用途: imageText
- タグ: [足楽] [使用シーン] [リアル]
- 推奨スライド: 「使用シーン」「顧客体験」章

---

### IMG_4600 2.PNG（老夫婦の使用シーン）
- Drive URL: https://drive.google.com/uc?id=17374ZQi6iHDMTicMB-qjp1t6CeIqk1K4&export=download
- Drive ファイルID: `17374ZQi6iHDMTicMB-qjp1t6CeIqk1K4`
- 内容: 老夫婦が足楽を使用しているシーン（シニア層向けの訴求画像）
- 用途: imageText
- タグ: [足楽] [使用シーン] [シニア] [夫婦] [整体向け] [痩身エステ向け]
- 推奨スライド: 「幅広い顧客層」「シニア市場」章（整体院・接骨院向けに特に有効）

---

### IMG_4601 2.JPG
- Drive URL: https://drive.google.com/uc?id=10icg0Gf8akokOshqgPCx-UkP_Mg_nU32&export=download
- Drive ファイルID: `10icg0Gf8akokOshqgPCx-UkP_Mg_nU32`
- 内容: 足楽の使用シーン写真
- 用途: imageText
- タグ: [足楽] [使用シーン] [リアル]
- 推奨スライド: 「使用シーン」「顧客体験」章

---

### IMG_4602 2.JPG（製品ボックス・屋外）
- Drive URL: https://drive.google.com/uc?id=12k_oPd8CNFz0CbxsoTUUvGwu9C-vskzC&export=download
- Drive ファイルID: `12k_oPd8CNFz0CbxsoTUUvGwu9C-vskzC`
- 内容: 足楽の製品ボックスを屋外で撮影（ブランドイメージ写真）
- 用途: imageText / titleBgUrl
- タグ: [足楽] [製品] [ブランド] [屋外] [ナチュラル]
- 推奨スライド: 「製品紹介」「ブランドストーリー」章

---

### IMG_4603 2.JPG（母子の使用シーン）
- Drive URL: https://drive.google.com/uc?id=1s_vwtKaQvNk_Qwfi-ucOpInPHK6-Orbm&export=download
- Drive ファイルID: `1s_vwtKaQvNk_Qwfi-ucOpInPHK6-Orbm`
- 内容: 母親と子どもが一緒に足楽を使用しているシーン
- 用途: imageText
- タグ: [足楽] [使用シーン] [親子] [ファミリー] [親しみやすい]
- 推奨スライド: 「幅広い顧客層」「家族で使える」章

---

### IMG_4604 2.PNG（酵素粉クローズアップ）
- Drive URL: https://drive.google.com/uc?id=1iYBg7NwGQQFz-N5NgjxWOD_SnTe_8PNn&export=download
- Drive ファイルID: `1iYBg7NwGQQFz-N5NgjxWOD_SnTe_8PNn`
- 内容: 酵素粉（おがくず）のクローズアップ写真（素材感・自然派訴求）
- 用途: imageText / titleBgUrl
- タグ: [足楽] [酵素] [素材] [ナチュラル] [クローズアップ]
- 推奨スライド: 「成分・素材」「科学的根拠」章

---

### スクリーンショット 2026-03-02 17.29.06.png（TVメディア掲載）
- Drive URL: https://drive.google.com/uc?id=1r-z0B7P6EzaXWva1V8XbrB5RxIm3-sMn&export=download
- Drive ファイルID: `1r-z0B7P6EzaXWva1V8XbrB5RxIm3-sMn`
- 内容: テレビ番組で足楽が紹介された際のスクリーンショット（メディア掲載実績）
- 用途: imageText（エビデンス・権威性訴求専用）
- タグ: [足楽] [メディア] [TV] [権威性] [エビデンス]
- 推奨スライド: 「メディア掲載実績」「権威性・信頼性」章

---

### AdobeStock_622110607.jpeg ※使用不可
- Drive ファイルID: `1vP26AgnKERP3WVzMy2Sg9pZ6UQtNntAi`
- 内容: 真っ白（撮影失敗または意図不明）
- 用途: **使用禁止**
- タグ: [除外]

---

## ターゲット別・推奨 titleBgUrl 早見表

| ターゲット | 推奨画像 | ファイルID |
|-----------|---------|-----------|
| 痩身エステサロン | AdobeStock_1142210683.jpeg（女性・酵素浴） | `1av9LHB0rYSHkM4WKMd7iN75fgc-V1IP7` |
| 整体院・接骨院 | AdobeStock_1142210683.jpeg（女性・酵素浴） | `1av9LHB0rYSHkM4WKMd7iN75fgc-V1IP7` |
| フィットネスジム | AdobeStock_273084234.jpeg（女性・ライフスタイル） | `1AIr7uq4wobfsMN8U4wm-Jbht80X2510t` |
| 鍼灸院 | IMG_4604 2.PNG（酵素粉クローズアップ） | `1iYBg7NwGQQFz-N5NgjxWOD_SnTe_8PNn` |
| 汎用（デフォルト） | AdobeStock_1142210683.jpeg（女性・酵素浴） | `1av9LHB0rYSHkM4WKMd7iN75fgc-V1IP7` |
