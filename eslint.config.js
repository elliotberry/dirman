import perfectionist from "eslint-plugin-perfectionist"
import prettierConfig from "eslint-plugin-prettier/recommended"
import is from "eslint-plugin-simple-import-sort"
import eslintPluginUnicorn from "eslint-plugin-unicorn"

export default [
  prettierConfig,
  eslintPluginUnicorn.configs["flat/recommended"],

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module"
    },
    plugins: {
      "simple-import-sort": is,
      perfectionist
    },

    rules: {
      "no-console": "off",
      "no-unused-vars": "warn",

      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
      "unicorn/no-null": "warn",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/prevent-abbreviations": "warn"
    }
  }
]
