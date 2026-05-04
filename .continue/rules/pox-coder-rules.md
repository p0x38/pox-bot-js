---
description: Discordコマンドの応答オブジェクト形式とFluent統合の厳守
---

# Response Shaping & Fluent Localization

PoxBot2では、ユーザーへのメッセージを直接コード内に記述しません。

## ルール

- **戻り値の型**: コマンドの `execute` メソッドは必ず `Response` 型（`{ key: string, variables?: object }`）を返してください。
- **メソッド禁止**: `interaction.reply()` や `channel.send()` をロジック内で直接呼び出すのは禁止です。
- **Fluent変数**: 変数は `{$var}` 形式で `.ftl` ファイルに定義されるため、`variables` オブジェクトのキーと一致させてください。

## 例

```typescript
return {
    key: 'command-success',
    variables: { user: interaction.user.username },
};
```
