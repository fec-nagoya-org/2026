# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

フロントエンドカンファレンス名古屋 2026 の公式Webサイト。LP1枚構成の静的サイトで、GitHub Pagesでホスティング。

- 本番URL: https://fec-nagoya-org.github.io/2026/
- イベント日: 2026年5月9日（土）
- 会場: ウインクあいち

## Tech Stack

- HTML + Tailwind CSS v4 (CLI)
- Biome (Linter / Formatter)
- Bun (パッケージマネージャー / ランタイム)
- Lefthook (Git hooks)
- Google Fonts (Modak, Noto Sans JP)

## Commands

```bash
bun i                # 依存関係のインストール
bun dev              # 開発サーバー起動 + Tailwind CSSウォッチモード (port 3000)
bun run build        # Tailwind CSS本番ビルド（minify）
bun run check        # Biome lint / format（自動修正）
```

## Architecture

- `index.html` - サイト本体（LP1枚構成）
- `src/input.css` - Tailwind CSS入力ファイル（`@import "tailwindcss"` + `@theme` によるカスタムテーマ定義）
- `style.css` - Tailwind CLIが生成する出力CSS（git管理対象、直接編集不可）
- `assets/` - 画像アセット（ロゴ、OGP画像、favicon等）
- `server.js` - Bun製の開発用静的ファイルサーバー（port 3000、起動時にブラウザを自動オープン）
- `biome.json` - Biome設定（インデント: タブ、クォート: ダブル、recommended rules、Tailwindディレクティブ対応）
- `lefthook.yml` - pre-commit: Biome check、post-merge: bun.lock変更時に自動 `bun install`

## Page Structure

1. Hero - ロゴ、日付、会場名
2. HEADS UP! - カンファレンス紹介
3. TICKETS - チケット購入リンク（Fortee）
4. TIMETABLE - タイムテーブルリンク（Fortee）
5. LINKS - 公式X、公式note
6. LOCATION - 会場アクセス情報
7. SPONSORS - スポンサー一覧（Platinum/Gold/Silver/Bronze）
8. JOB BOARD - 求人情報
9. Footer - リンク、コピーライト

## Theme

`src/input.css` の `@theme` で以下を定義:
- フォント: `--font-display`（Modak）、`--font-sans`（Noto Sans JP）
- カラー: `--color-accent`（オレンジ）

## Coding Conventions

- インデントはタブ
- JavaScript文字列はダブルクォート
- Biomeのrecommended rulesに準拠

## Deploy

- GitHub Pages（静的配信）
- `style.css` はビルド成果物だがgit管理対象。`bun run build` でデプロイ前に再生成すること
