# UI設計フレームワーク — 8層20ステップ

> このファイルは `/ui` と `/ui-spec` スキルの共通フレームワーク定義。
> 両スキルはこのファイルを読み込み、設計・解析・仕様化の全フェーズで準拠する。

---

## depth 定義

| depth | 出力レベル | 用途 |
|-------|-----------|------|
| **quick** | 各ステップの主要項目のみ（箇条書き） | PoC・ラフ設計・スピード優先 |
| **standard** | 全ステップ・主要項目 + 理由（Why）1〜2行 | 通常の設計・実装前レビュー |
| **exhaustive** | 全ステップ・全詳細・エッジケース・代替案 | 本番設計・チームレビュー・仕様書 |

---

## 8層20ステップ 一覧

| # | 層 | ステップ名 | 内容概要 |
|---|-----|-----------|---------|
| 1 | **A. 要件定義層** | Goals & Scope | 目的・スコープ・成功指標 |
| 2 | **A. 要件定義層** | User Stories | ユーザーペルソナ・ユースケース・優先度 |
| 3 | **B. データ層** | Data Model | エンティティ定義・型・バリデーション |
| 4 | **B. データ層** | State Design | ローカル / グローバル状態・派生状態 |
| 5 | **B. データ層** | API & Data Flow | エンドポイント・リクエスト/レスポンス・エラー |
| 6 | **C. 体験層** | User Flow | タスクフロー・ナビゲーション・分岐 |
| 7 | **C. 体験層** | Interaction Design | マイクロインタラクション・フィードバック・アニメーション |
| 8 | **C. 体験層** | Permission & Access | ロール・権限・アクセス制御 |
| 9 | **D. 視覚層** | Visual Design System | カラー・タイポ・スペーシング・グリッド・コンポーネント |
| 10 | **E. コンテンツ層** | Microcopy Design | ラベル・CTA・エラーメッセージ・Tooltip |
| 11 | **E. コンテンツ層** | Information Architecture | コンテンツ階層・ラベリング・検索・フィルタ |
| 12 | **F. ライフサイクル層** | States | Empty / Loading / Error / Success / Onboarding 各状態 |
| 13 | **F. ライフサイクル層** | History | Undo/Redo・バージョン管理・変更履歴 |
| 14 | **F. ライフサイクル層** | Notifications & Feedback | Toast・バナー・バッジ・リアルタイム更新 |
| 15 | **G. システム層** | Performance | レンダリング最適化・遅延読み込み・キャッシュ |
| 16 | **G. システム層** | Error Handling | エラー境界・フォールバック・リトライ戦略 |
| 17 | **G. システム層** | Security & Validation | 入力サニタイズ・CSRF・XSS・認可 |
| 18 | **H. 検証層** | Accessibility | WCAG AA 準拠・キーボード操作・スクリーンリーダー |
| 19 | **H. 検証層** | Testing Strategy | ユニット・インテグレーション・E2E・ビジュアル回帰 |
| 20 | **H. 検証層** | Analytics & Metrics | 計測イベント・KPI・A/Bテスト設計 |

---

## ステップ名エイリアス（step 引数の受け付け値）

各ステップは以下のエイリアスで指定可能:

| step 引数 | 対応ステップ |
|----------|------------|
| `Goals`, `Scope` | 1. Goals & Scope |
| `UserStory`, `Persona` | 2. User Stories |
| `DataModel`, `Model` | 3. Data Model |
| `State` | 4. State Design |
| `API`, `DataFlow` | 5. API & Data Flow |
| `Flow`, `UserFlow` | 6. User Flow |
| `Interaction` | 7. Interaction Design |
| `Permission`, `Access` | 8. Permission & Access |
| `Visual`, `Design` | 9. Visual Design System |
| `Microcopy`, `Copy` | 10. Microcopy Design |
| `IA`, `Architecture` | 11. Information Architecture |
| `States`, `EmptyState` | 12. States |
| `History`, `Undo` | 13. History |
| `Notification` | 14. Notifications & Feedback |
| `Performance` | 15. Performance |
| `ErrorHandling` | 16. Error Handling |
| `Security`, `Validation` | 17. Security & Validation |
| `A11y`, `Accessibility` | 18. Accessibility |
| `Testing`, `Test` | 19. Testing Strategy |
| `Analytics`, `Metrics` | 20. Analytics & Metrics |

---

## depth 別の出力フォーマット

### quick
- 各ステップを箇条書き（3〜5 項目）で出力
- Why（理由）は省略可
- コード例・図は省略

### standard
- 各項目に 1〜2 行の Why を付記
- 代表的なコード例・擬似コードを含む
- エッジケースは主要なもののみ

### exhaustive
- 全項目に詳細な Why + トレードオフを記述
- コード例・型定義・API仕様を完全に記述
- エッジケース・アンチパターンを網羅
- 代替設計案を提示

---

## 出力ディレクトリ規則

```
[プロジェクトルート]/ui-specs/
└── [target]/
    ├── summary.md          # 全ステップへのリンク・進捗・Round番号
    ├── [target]_goals.md
    ├── [target]_user-stories.md
    ├── [target]_data-model.md
    └── ... (各ステップ個別ファイル)
```

`summary.md` フォーマット:
```markdown
# [target] UI設計 — Summary

| Round | 日付 | 対象ステップ | ステータス |
|-------|------|------------|---------|
| R1    | YYYY-MM-DD | 全体 (standard) | ✅ 完了 |
| R2    | YYYY-MM-DD | Microcopy 修正 | 🔄 進行中 |

## ステップ一覧
- [1. Goals & Scope](./[target]_goals.md) — ✅
- [2. User Stories](./[target]_user-stories.md) — ✅
...
```

<!-- TODO: depth: quick / standard / exhaustive の具体的な出力文字数・セクション数の定義を追記 -->
<!-- TODO: context パラメータの具体的な活用方法を追記 -->
