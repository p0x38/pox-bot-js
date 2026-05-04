# Translation keys

Base translation resources are stored in the resources/locales/en directory.
Translation files are in the resources/locales/<lang> directory.

Translation files are organized into the following categories:

## Commands (resources/locales/<lang>/commands.json)

- Translations for commands. Keys are structured by command name (`<command>.<type>.<key>`).
- **Examples:**
    - `help.messages.command_not_found`
    - `help.embeds.default.title`
    - `help.embeds.default.description`
    - `profile.common.unknown`
    - `profile.pages.info_title`
    - `profile.pages.stats_title`
    - `profile.fields.name`
    - `profile.fields.id`
    - `profile.fields.created_at`
    - `profile.fields.joined_at`
    - `profile.fields.roles`
    - `profile.fields.level`
    - `profile.fields.rank`
    - `profile.fields.total_xp`
    - `profile.fields.progress`
    - `profile.buttons.user_info`
    - `profile.buttons.level_stats`
    - `profile.messages.not_allowed`
    - `leaderboard.title`

## Commons (resources/locales/<lang>/common.json)

- Translations for common phrases, shared elements, and general bot text.
- **Examples:**
    - `messages.lang_updated`
    - `messages.levelup`
    - `errors.invalid_language`

## Embed-related (resources/locales/<lang>/embeds.json)

- Translations for shared embed structures or default embed texts not tied to a specific command.
- **Examples:**
    - _(Currently no specific keys, available for future shared embeds)_

## Error-related (resources/locales/<lang>/errors.json)

- Translations for errors and exceptions.
- **Examples:**
    - `command_failed`
    - `detail_label`
    - `unknown_error`

## Glossary (resources/locales/<lang>/glossary.json)

- Translations for specific domain terms or bot glossary items.
- **Examples:**
    - _(Currently no specific keys)_

## Logs (resources/locales/<lang>/logs.json)

- Translations for internal logging or audit logs.
- **Examples:**
    - _(Currently no specific keys)_

## Messages (resources/locales/<lang>/messages.json)

- Translations for standalone messages and generic chat responses.
- **Examples:**
    - `commands.ping.success`
    - `commands.setcolor.success`
    - `commands.leaderboard.empty`

## UI-related (resources/locales/<lang>/ui.json)

- Translations for UI components like buttons, dropdowns, or modals that are shared globally.
- **Examples:**
    - _(Currently no specific keys)_
