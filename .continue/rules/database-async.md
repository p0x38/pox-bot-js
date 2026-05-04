---
description: aiosqlite/PostgreSQLを意識した非同期データアクセスの作法
---

# Async Database Operations

PoxBot2のデータ層は、Discordボットのイベントループを止めないために非同期で動作します。

## ルール

- **Promise**: DB操作を伴う関数はすべて `Promise` を返すようにしてください。
- **型定義**: 取得したレコードには必ず型定義（Interface）を適用してください。
- **クエリ**: SQLインジェクションを防ぐため、パラメータバインド（`$1`, `$2` 等）を徹底してください。
