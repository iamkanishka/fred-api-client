// eslint.config.js — ESLint 9 flat config
// Converted from .eslintrc.json — same rules, new format
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // ── Replaces: "extends": ["eslint:recommended"] ─────────────────
  js.configs.recommended,

  // ── Replaces: "extends": ["plugin:@typescript-eslint/recommended"]
  ...tseslint.configs.recommended,

  // ── Replaces: "env", "parser", "parserOptions", "plugins" ───────
  {
    languageOptions: {
      ecmaVersion: 2023,          // Replaces: "es2023": true
      sourceType: 'module',       // Replaces: "sourceType": "module"
      globals: {
        // Replaces: "env": { "node": true }
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },

  // ── Ignored paths (replaces .eslintignore) ───────────────────────
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
);