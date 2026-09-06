import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config([
    {
        ignores: [
            'dist/',
            '**/*.js',
            'eslint.config.mjs',
            '**/.history/',
            '.release-it.ts',
            'tsconfig.json',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            'import-x': importX,
            'unused-imports': unusedImports,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.test.json'],
                tsconfigRootDir: import.meta.dirname,
                noWarnOnMultipleProjects: true,
            },
        },
        settings: {
            'import-x/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: ['./tsconfig.json', './tsconfig.test.json'],
                    extensions: [
                        '.ts',
                        '.tsx',
                        '.d.ts',
                        '.js',
                        '.jsx',
                        '.json',
                    ],
                },
                node: {
                    extensions: [
                        '.ts',
                        '.tsx',
                        '.d.ts',
                        '.js',
                        '.jsx',
                        '.json',
                    ],
                },
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-console': 'off',
            'sort-imports': 'off',

            'unused-imports/no-unused-imports': 'warn',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            'import-x/first': 'warn',
            'import-x/no-duplicates': 'warn',
            'import-x/no-cycle': 'error',
            'import-x/no-unresolved': 'error',

            'import-x/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling', 'index'],
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
]);
