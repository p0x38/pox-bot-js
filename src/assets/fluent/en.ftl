# Global Variables: $personality, $intensity, $emotion, $streak, $user, $level, $count, $amount

profile-options-target-description =
    The user whose profile you want to see

profile-messages-need-xp =
    { $personality ->
        [casual]
            { $emotion ->
                [annoyed] (ugh) That's {$streak} times now... Just {$amount} more XP...
                [frustration] Seriously? You've done this {$streak} times. STOP.
               *[default] Need {$amount} more XP point to level up!
            }
        [formal] Approximately {$amount} experience points are required for the next level.
        [silly] Just {$amount} more points until we go UP! :3
        [chaotic] FEED ME {$amount} XP!!!
        [robotic] CALCULATING... {$amount} UNITS REQUIRED.
       *[default] Need {$amount} more XP points to level up!
    }

profile-embeds-main-title =
    { $personality ->
        [casual]
            { $intensity ->
                [high] YO! Check this profile!
               *[normal] User Profile
            }
        [formal] User Profile Report
        [silly] User Profile :3
        [chaotic] WHO IS THIS??
        [robotic] ACCESSING USER DATA...
       *[default] User Profile
    }

profile-embeds-main-description =
    { $personality ->
        [casual] Current status for {$user}
        [formal] Detailed status report for subject: {$user}
        [silly] Look at how awesome {$user} is! ✨
        [chaotic] DATA FOR THE VOID: {$user}
        [robotic] SUBJECT_IDENTIFIER: {$user}
       *[default] Current status for {$user}
    }

profile-common-unknown = Unknown
profile-pages-info-title = User Information
profile-pages-stats-title = Level Statistics
profile-fields-name = Name
profile-fields-id = ID
profile-fields-created-at = Created At
profile-fields-joined-at = Joined At
profile-fields-roles = Roles
profile-fields-level = Level
profile-fields-rank = Global Rank
profile-fields-total-xp = Total XP
profile-fields-progress = Progress to Level {$level}
profile-buttons-user-info = User Info
profile-buttons-level-stats = Level Stats
profile-messages-not-allowed = Only the command user can flip pages.

common-errors-invalid-language = That language isn't supported yet!
common-lang-updated =
    { $personality ->
        [playful] Updated language to {$lang}! :3
        [formal] System language has been successfully adjusted to {$lang}.
       *[default] Updated language to {$lang}!
    }

commands-ping-success =
    { $personality ->
        [casual] Pong! Latency is {$latency}ms.
        [robotic] LATENCY_CHECK: {$latency}MS.
       *[default] Pong! Latency is {$latency}ms.
    }

messages-commands-leaderboard-empty = No users found on the leaderboard yet!
messages-commands-leaderboard-title = Global Leaderboard
messages-commands-setcolor-success = Profile color updated!

commands-reload-messages-lang-success = Reloaded all translation files!
commands-reload-messages-missing-command = Please provide a command name to reload.

messages-levelup =
    { $personality ->
        [casual]
            { $emotion ->
                [joy] WOOHOO! You hit level {$level}! 🎉
               *[default] You're leveled up to {$level}!
            }
        [silly] Level {$level} reached! So proud of you! :3
        [robotic] LEVEL_UP_DETECTED. NEW_LEVEL: {$level}.
       *[default] You're leveled up to {$level}!
    }

command-failed =
    { $emotion ->
        [annoyed] (sigh) Something went wrong. Again.
        [frustration] I CAN'T EVEN. The command failed.
        [panic] AAAAA! ERROR! SOMETHING BROKE!
       *[default] An error occurred while executing the command!
    }

detail-label =
    { $personality ->
        [robotic] ERROR_LOG:
       *[default] Error details:
    }

unknown-error =
    { $personality ->
        [chaotic] THE UNKNOWN CONSUMES US.
       *[default] Unknown error.
    }

errors-guild-only-command = This command can be used only in guild!
errors-invalid-member-format = It seems you specified member format wrongly. Use Mention or ID, not "{ $input }".
errors-member-not-found = There was no member called "{ $input }"...