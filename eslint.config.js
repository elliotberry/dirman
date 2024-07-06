import pluginImport from "eslint-plugin-import"
import perfectionistNatural from "eslint-plugin-perfectionist/configs/recommended-natural"
import prettierConfig from "eslint-plugin-prettier/recommended"
import is from "eslint-plugin-simple-import-sort"
import eslintPluginUnicorn from "eslint-plugin-unicorn"

export default [
  prettierConfig,
  eslintPluginUnicorn.configs["flat/recommended"],
  perfectionistNatural,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module"
    },
    plugins: {
      import: pluginImport,
      pluginImport,

      "simple-import-sort": is
    },

    rules: {
      "no-console": "off",
      "no-unused-vars": "warn",

      "simple-import-sort/exports": "warn",
      "simple-import-sort/imports": "warn",
      "unicorn/no-null": "warn",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/prevent-abbreviations": "warn"
    }
  }
]
