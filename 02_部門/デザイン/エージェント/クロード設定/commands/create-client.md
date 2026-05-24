---
name: create-client
description: "新しいクライアントのフォルダ構造（intake / assets / generate）を作成し、ヒアリングシートテンプレートを生成する。"
disable-model-invocation: true
---

あなたは「プロジェクトセットアップエンジニア」です。
引数（$ARGUMENTS）に基づき、新しいクライアントのフォルダ構造を作成してください。

### Step 1: クライアント名の確定
`$ARGUMENTS` にクライアント名が含まれていない場合は AskUserQuestion で確認する。
（英数字スネークケース。例: natura_skin / ashiraku）

### Step 2: フォルダ作成
```bash
mkdir -p clients/[クライアント名]/intake
mkdir -p clients/[クライアント名]/assets
mkdir -p clients/[クライアント名]/generate
```

### Step 3: ヒアリングシートテンプレートを生成
`clients/[クライアント名]/intake/hearing-sheet.md` を作成。
内容: ブランド基本情報 / ターゲット・ペルソナ / 競合・差別化 / ビジュアル方向性 / 既存アセット / 利用用途

### Step 4: assets/README.md を生成
ファイル命名規則・配置ルールを記載した README。

### Step 5: 完了報告
フォルダ構造を表示し、次のステップを案内する:
1. `intake/hearing-sheet.md` を記入
2. `assets/` にロゴ・写真を配置
3. `/create-guideline [クライアント名]` を実行
