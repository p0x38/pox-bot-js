---
description: BaseConverterを継承した引数変換システムの構築ルール
---

# Argument Converter Pattern

ユーザー入力をオブジェクトに変換する際は、既存の基底クラスを継承してください。

## ルール

- **継承**: すべてのコンバーターは `src/converters/BaseConverter.ts` を継承します。
- **メソッド署名**: `convert(ctx: Context, value: string): Promise<T | null> | T | null` を守ってください。
- **非同期処理**: データベース（PostgreSQL/aiosqlite）を参照する場合は `async/await` を使用してください。
- **エラーハンドリング**: 変換失敗時は `null` を返し、例外をスローしないでください。
