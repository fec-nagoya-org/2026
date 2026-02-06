# Frontend Conference Nagoya 2026

フロントエンドカンファレンス名古屋 2026 の公式Webサイト（LP1枚構成）

## Tech Stack

- HTML
- Tailwind CSS v4 (CLI)
- Biome (Linter / Formatter)
- GitHub Pages

## Development

```bash
# 依存関係のインストール
bun i

# 開発（ウォッチモード）
bun dev

# CSSビルド
bun run build

# Lint / Format（自動修正）
bun run check
```

## Project Structure

```
├── src/
│   └── input.css       # Tailwind CSS 入力ファイル
├── index.html          # メインページ
├── style.css           # ビルド出力（自動生成）
├── package.json
└── CLAUDE.md
```
