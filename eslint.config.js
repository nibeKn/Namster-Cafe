/**
 * ESLint flat config. Vue's recommended rules plus the few that encode
 * decisions specific to this project. `eslint-config-prettier` comes last to
 * switch off everything purely stylistic — Prettier owns formatting.
 */

import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,
  ...vue.configs['flat/recommended'],

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      /* Section components are deliberately single nouns (HeroSection). */
      'vue/multi-word-component-names': 'off',

      /* Every SFC follows script → template → style. */
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],

      /* Typed, defaulted props keep the component tree readable. */
      'vue/require-prop-types': 'error',
      'vue/require-default-prop': 'error',

      /* Keeps debug logging out of the production bundle. */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },

  prettier,
]
