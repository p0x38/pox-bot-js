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

messages-lang-updated =
    { $personality ->
        [playful] Updated language to {$lang}! :3
        [formal] System language has been successfully adjusted to {$lang}.
       *[default] Updated language to {$lang}!
    }

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