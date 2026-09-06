import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config([
    {
        ignores: [
            'dist/',
            'node_modules/',
            '*.js',
            'eslint.config.mjs',
            '.prettierrc',
            '.release-it.ts',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.test.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
            'no-console': 'off',
        },
    },
]);
