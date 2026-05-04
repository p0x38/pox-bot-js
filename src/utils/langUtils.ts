import ISO6391 from 'iso-639-1';

export const normalizeLangName = (code: string): string => {
    return ISO6391.getNativeName(code) || code.toUpperCase();
};
