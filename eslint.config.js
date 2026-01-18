import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    extends: [eslintJs.configs.recommended, ...tseslint.configs.recommendedTypeChecked, prettierConfig],
    rules: {
      'no-console': 'warn'
    }
  }
);
