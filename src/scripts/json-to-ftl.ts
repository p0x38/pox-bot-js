//import logger from '../logger.js';
import {
    mkdirSync,
    readdirSync,
    readFileSync,
    statSync,
    writeFileSync,
} from 'node:fs';
import { basename, join } from 'node:path';

const INPUT_DIR = join(process.cwd(), 'src/locales');
const OUTPUT_DIR = join(process.cwd(), 'src/fluent');
const warnings: string[] = [];

function flatten(obj: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}-${key}` : key;

        if (typeof value === 'object' && value !== null) {
            Object.assign(result, flatten(value, newKey));
        } else {
            result[newKey] = String(value);
        }
    }

    return result;
}

function convertPlaceholders(str: string) {
    return str
        .replace(/\{\{\s*(\w+)\s*\}\}/g, '{$1}')
        .replace(/\{(\w+)\}/g, '{$1}');
}

function convertFile(file: string) {
    const locale = basename(file);

    const inputPath = join(INPUT_DIR, locale);
    const outputPath = join(OUTPUT_DIR, `${locale}.ftl`);

    const files = readdirSync(inputPath);

    let output = '';

    for (const f of files) {
        const full = join(inputPath, f);
        const json = JSON.parse(readFileSync(full, 'utf-8'));

        const flat = flatten(json);

        for (const [key, value] of Object.entries(flat)) {
            output += `${key} = ${convertPlaceholders(value)}\n`;
        }

        output += '\n';
    }

    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(outputPath, output.trim());
}

function main() {
    const locales = readdirSync(INPUT_DIR);

    for (const locale of locales) {
        const file = join(INPUT_DIR, locale);

        if (!statSync(file).isDirectory()) continue;

        convertFile(file);
        console.log(`✔ Converted ${locale}`);
    }

    if (warnings.length) {
        console.log('\n⚠ Warnings:');
        warnings.forEach((w) => console.log(' - ' + w));
    }
}

main();
