import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores - must be first
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'next-env.d.ts',
      '**/.next/**',
      '**/node_modules/**',
    ],
  },
  // Extend Next.js configs
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // Plugin configuration
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Turn off the base rule as it can report incorrect errors
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      // Configure unused-imports rules
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];

export default eslintConfig;
