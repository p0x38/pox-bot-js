export interface I18nProvider {
    t(locale: string, key: string, args?: Record<string, any>): string;
}
