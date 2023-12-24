module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'standard-with-typescript',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    'no-template-curly-in-string': 'off', // serverless.tsで利用するためoff
    '@typescript-eslint/prefer-nullish-coalescing': 'off', // strictNullChecks:trueが必要。strictNullChecksはsupabaseのDatabase型と相性が悪いためoff
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/require-await': 'off', // インターフェースでawaitが必要だが実装では必要としないケースがあるためoff
    // '@typescript-eslint/explicit-function-return-type': 'off', // 戻り値の型が分からない場合があるためoff
    '@typescript-eslint/no-redundant-type-constituents': 'off', // 自動生成するsrc/libs/supabase/database.ts 内で引っかかるためoff
    '@typescript-eslint/explicit-function-return-type': 'off', // handler周りなど戻り値の型を明示できないことがあるのでoff
    '@typescript-eslint/consistent-type-assertions': 'off', // as で型を指定したいことがあるためoff
  },
}
