# Figmaデザイン反映 実装計画

## Context

Figmaデザイン（Desktop - 1: node 299:366）のスタイルを現在の最小構成のindex.htmlに反映する。
現在のindex.htmlはh1とpタグのみで、Figmaに定義されたLPの全セクション構造・スタイリングを実装する必要がある。

## 確認済み情報

- **フォント**: 見出し=Modak、本文=Noto Sans JP（どちらもGoogle Fonts）
- **日付**: 2026.05.09（土）
- **アセット**: ユーザが `assets/` ディレクトリに提供予定
  - Heroロゴ、スターバーストグラフィック、Footerロゴ、アクセス案内図
- **カラー**: 白黒基調、オレンジアクセント

## 修正対象ファイル

1. `/Users/yumasatake/Documents/Github/2026/src/input.css` - @theme定義、カスタムCSS追加
2. `/Users/yumasatake/Documents/Github/2026/index.html` - 全セクションのHTML構造とTailwindクラスの実装

## 実装ステップ

### Step 1: `src/input.css` にテーマとカスタムCSS追加

- Tailwind v4 の `@theme` ディレクティブでカスタム定義
  - カラー: accent(オレンジ), bg-dark, text-muted等
  - フォント: `--font-display: "Modak"`, `--font-body: "Noto Sans JP"`
  - 幅: `--width-content: 402px`
- 曲線セパレータ用のカスタムCSS（不要ならTailwindのみで対応）
- 背景ウォーターマーク用の疑似要素スタイル

### Step 2: `index.html` のHTML構造を実装

以下のセクションを上から順に実装:

1. **`<head>`**: Google Fonts読み込み（Modak, Noto Sans JP）、meta情報追加
2. **Hero**: ダーク背景、ロゴ(img placeholder)、日付、会場名、スターバーストグラフィック(img placeholder)
3. **HEADS UP!**: 重なり合うテキストエフェクト（opacity + translate-y）、説明文3段
4. **曲線セパレータ**: SVG ellipseによるダーク→ホワイト遷移
5. **TICKETS**: Modak見出し、Forteeリンクボタン（プライマリ/セカンダリ）
6. **TIMETABLE**: Modak見出し、ボタンリンク
7. **LINKS**: Modak見出し、公式X/noteボタン
8. **曲線セパレータ**: SVG（ホワイト→ホワイト with border）
9. **LOCATION**: 会場名、アクセス案内（電車/飛行機）、img placeholder
10. **曲線セパレータ**: SVG
11. **SPONSORS**: Platinum(1列)/Gold(1列)/Silver(2列)/Bronze(2列) のグリッドプレースホルダ
12. **装飾バナー**: 斜めストライプの「NAGOYA 2026 CONFERENCE」テキスト
13. **JOB BOARD**: Modak見出し、プレースホルダカード×4
14. **Footer**: ロゴ(img placeholder)、リンク（行動規範/公式X/公式note）、コピーライト

### Step 3: スタイリング詳細

- **ボタン**: プライマリ=`bg-black text-white rounded-full`、セカンダリ=`border-2 border-black rounded-full`
- **セクション見出し**: `font-display`（Modak）、大きなサイズ
- **レスポンシブ**: モバイルファースト、402px幅中央配置
- **背景ウォーターマーク**: 全ページに薄い「フロカン」テキスト（`::before` 疑似要素 or 背景パターン）

### Step 4: 品質チェック

- `bun run check` (Biome lint/format)
- 開発サーバーで表示確認

## アセットプレースホルダ

アセットがまだ提供されていないため、以下のパスでimg要素を配置し、alt属性で内容を示す:

```
assets/logo.svg          - Heroロゴ
assets/logo-footer.svg   - Footerロゴ
assets/starburst.svg     - オレンジのスターバースト
assets/access-train.svg  - 電車アクセス案内図
assets/access-plane.svg  - 飛行機アクセス案内図
```

## 検証方法

1. `bun run build` でTailwind CSSビルド成功を確認
2. `bun run check` でBiomeエラーなしを確認
3. `bun dev` で開発サーバー起動、ブラウザで各セクションの見た目を確認
