# グローバル変数: $personality, $intensity, $emotion, $user, $level, $count, $amount

profile-options-target-description =
    プロフィールを確認したいユーザー

profile-messages-need-xp =
    { $personality ->
        [casual]
            { $emotion ->
                [annoyed] （はぁ…）もう{$streak}回目だよ？あと{$amount}XPだってば。
                [frustration] {$streak}回も同じことして…あと{$amount}XP。いい加減にして。
               *[default] レベルアップまであと{$amount}XP必要だよ〜！
            }
        [formal] 次のレベルに到達するには、あと{$amount}経験値が必要です。
        [silly] あと{$amount}ポイントでレベルアップだね！がんばれ〜！ :3
        [chaotic] もっとXPをよこせ！！あと{$amount}だ！！
        [robotic] 計算中... 残り{$amount}ユニットが必要です。
       *[default] レベルアップまであと{$amount}XP必要だよ〜！
    }

profile-embeds-main-title =
    { $personality ->
        [casual]
            { $intensity ->
                [high] おっ！このプロフィール見てよ！
               *[normal] ユーザープロフィール
            }
        [formal] ユーザー情報レポート
        [silly] ユーザープロフィール :3
        [chaotic] 誰だお前は！？
        [robotic] ユーザーデータにアクセス中...
       *[default] ユーザープロフィール
    }

profile-embeds-main-description =
    { $personality ->
        [casual] {$user}の現在の状態だよ〜
        [formal] 対象者「{$user}」の詳細ステータスレポートです。
        [silly] {$user}ってこんなにすごいんだよ！見て見て！ ✨
        [chaotic] 無限のデータ：{$user}
        [robotic] 対象識別子：{$user}
       *[default] {$user}の現在の状態だよ〜
    }

profile-common-unknown = 不明
profile-pages-info-title = ユーザー情報
profile-pages-stats-title = レベル統計
profile-fields-name = 名前
profile-fields-id = ID
profile-fields-created-at = 作成日
profile-fields-joined-at = 参加日
profile-fields-roles = ロール
profile-fields-level = レベル
profile-fields-rank = ランク
profile-fields-total-xp = 合計XP
profile-fields-progress = レベル {$level} への進捗
profile-buttons-user-info = ユーザー情報
profile-buttons-level-stats = レベル統計
profile-messages-not-allowed = コマンドを実行した本人しかページをめくれないよ。

common-errors-invalid-language = その言語はまだサポートされてないよ！
common-lang-updated =
    { $personality ->
        [silly] 言語を{$lang}に変えたよ！ :3
        [formal] システム言語が正常に{$lang}へ変更されました。
       *[default] 言語を{$lang}に更新しました！
    }

commands-ping-success =
    { $personality ->
        [casual] ポン！レイテンシは {$latency}ms だよ。
        [robotic] レイテンシ確認：{$latency}MS。
       *[default] ポン！レイテンシは {$latency}ms だよ。
    }

messages-commands-leaderboard-empty = リーダーボードにまだ誰もいないみたいだよ。
messages-commands-leaderboard-title = グローバルリーダーボード
messages-commands-setcolor-success = プロフィールの色を更新したよ！

commands-reload-messages-lang-success = すべての翻訳ファイルを読み込み直したよ！
commands-reload-messages-missing-command = リロードするコマンド名を指定してね。

messages-levelup =
    { $personality ->
        [casual]
            { $emotion ->
                [joy] やったー！レベル{$level}になったよ！ 🎉
               *[default] レベル{$level}に上がったよ！
            }
        [silly] レベル{$level}だね！本当におめでとう！ :3
        [robotic] レベルアップを検知。新レベル：{$level}。
       *[default] レベル{$level}に上がったよ！
    }

command-failed =
    { $emotion ->
        [annoyed] （ため息）また何かがおかしいみたい。
        [frustration] もう無理。コマンドが失敗したよ。
        [panic] ああああ！エラーだ！何かが壊れた！
       *[default] コマンドの実行中にエラーが発生したよ！
    }

detail-label =
    { $personality ->
        [robotic] エラーログ：
       *[default] エラーの詳細：
    }

unknown-error =
    { $personality ->
        [chaotic] 未知の何かが私たちを飲み込もうとしている。
       *[default] 不明なエラーだよ。
    }