import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['src/app/test/**'],
  },
  // ⚙️ Kế thừa cấu hình mặc định từ Next.js
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // ✅ Thêm luật tùy chỉnh tại đây
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'no-console': 'off',
      // "no-debugger": "error",
      // "eqeqeq": ["error", "always"],
      indent: ['error', 2],
      'no-unused-vars': 'off', // ❌ Tắt rule gốc
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // ✅ Bỏ qua tham số bắt đầu bằng _
          varsIgnorePattern: '^_', // ✅ Bỏ qua biến khai báo bắt đầu bằng _
          caughtErrorsIgnorePattern: "^_", // 👉 Bỏ qua catch (_e)
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];

export default eslintConfig;
