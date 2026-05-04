export function resolveLocale(
    userLang?: string,
    guildLang?: string,
    defaultLang = 'en',
) {
    return userLang || guildLang || defaultLang;
}
