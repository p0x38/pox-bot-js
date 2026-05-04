---
description: PoxBot2 のコアアーキテクチャとコーディング標準
---

# PoxBot2 Project Architecture

PoxBot2 は、ロジックと表現を完全に分離した、スケーラブルな TypeScript Discord.js ボットです。

## ディレクトリ構造

- `/src/commands`: コマンドの実行ロジック。
- `/src/converters`: `BaseConverter` を継承した引数変換クラス。
- `/src/assets/fluent`: Fluent (`.ftl`) による多言語翻訳リソース。
- `/src/framework`: Response Shaping を支えるコアシステム（Proxial）。

## コーディング標準

### 1. 型の安全性 (Type Safety)

- すべての新しいファイルには **TypeScript** を使用してください。
- `any` の使用を避け、インターフェースまたは `type` を定義してください。

### 2. 応答パターン (Response Shaping)

- 文字列をハードコードしないでください。
- すべてのコマンドは、`src/assets/fluent` 内のキーを参照するオブジェクトを返してください。
- 形式: `{ key: string, variables?: Record<string, any> }`

### 3. 非同期処理

- データベース（aiosqlite / PostgreSQL）へのアクセスや外部 API 連携は、常に `async/await` を使用してください。
- イベントループをブロックする同期処理（`readFileSync` など）は厳禁です。

### 4. 命名規則

- クラス名: `PascalCase` (例: `MemberConverter`)
- 変数・関数名: `camelCase` (例: `executeCommand`)
- 翻訳キー: `kebab-case` (例: `command-error-timeout`)

## 開発環境の制約

- このプロジェクトは **i7-4770 / RAM 12GB** 環境で開発されています。
- AI は、不必要に冗長な解説を避け、即座に実装可能なコードを提供してください。
