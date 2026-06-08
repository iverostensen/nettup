import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: null,
      },
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    // Meta Pixel + gtag are runtime globals injected by their snippets.
    // The astro plugin lints <script> blocks as virtual files (e.g.
    // Foo.astro/1_1.ts), so the globs must cover those too.
    files: ['**/*.astro', '**/*.astro/**'],
    languageOptions: {
      globals: {
        fbq: 'readonly',
        gtag: 'readonly',
      },
    },
  },
  {
    // The official Meta Pixel snippet uses a leading-bang IIFE (`!function(){}()`),
    // which ESLint flags as an unused expression. Allow it in the layouts that embed it.
    files: [
      'src/layouts/BaseLayout.astro',
      'src/layouts/BaseLayout.astro/**',
      'src/layouts/LandingPageLayout.astro',
      'src/layouts/LandingPageLayout.astro/**',
    ],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.astro/', '.vercel/'],
  },
];
