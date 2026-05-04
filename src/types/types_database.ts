export interface UserSettings {
    language?: string;
    embed_color?: string;
    [key: string]: any;
}

export interface UserStats {
    xp: number;
    level: number;
    [key: string]: any;
}

export interface UserDataRow {
    user_id: string;
    stats: UserStats;
    settings: UserSettings;
    created_at: Date;
    updated_at: Date;
    last_message_at: Date;
}
