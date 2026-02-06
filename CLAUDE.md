# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

フロントエンドカンファレンス名古屋 2026 の公式Webサイト。LP1枚構成の静的サイトで、GitHub Pagesでホスティング。

## Tech Stack

- HTML + Tailwind CSS v4 (CLI)
- Biome (Linter / Formatter)
- Bun (パッケージマネージャー / ランタイム)
- Lefthook (Git hooks)

## Commands

```bash
bun i                # 依存関係のインストール
bun dev              # 開発サーバー起動 + Tailwind CSSウォッチモード (port 3000)
bun run build        # Tailwind CSS本番ビルド（minify）
bun run check        # Biome lint / format（自動修正）
```

## Architecture

- `index.html` - サイト本体（LP1枚構成）
- `src/input.css` - Tailwind CSS入力ファイル（`@import "tailwindcss"` のみ）
- `style.css` - Tailwind CLIが生成する出力CSS（gitignore対象、直接編集不可）
- `server.js` - Bun製の開発用静的ファイルサーバー（port 3000、起動時にブラウザを自動オープン）
- `biome.json` - Biome設定（インデント: タブ、クォート: ダブル、recommended rules）
- `lefthook.yml` - pre-commit: Biome check、post-merge: bun.lock変更時に自動 `bun install`

## Coding Conventions

- インデントはタブ
- JavaScript文字列はダブルクォート
- Biomeのrecommended rulesに準拠
