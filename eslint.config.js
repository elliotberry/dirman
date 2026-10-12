import importPlugin from "eslint-plugin-import"
import perfectionist from "eslint-plugin-perfectionist"
import prettierConfig from "eslint-plugin-prettier/recommended"
import is from "eslint-plugin-simple-import-sort"
import sonarjs from "eslint-plugin-sonarjs"
import eslintPluginUnicorn from "eslint-plugin-unicorn"

export default [
  prettierConfig,
  eslintPluginUnicorn.configs.recommended,
  sonarjs.configs.recommended,
  importPlugin.flatConfigs.recommended,

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
      "import/no-unresolved": ["error", { ignore: ["yargs/helpers"] }],
      "no-console": "off",
      "no-unused-vars": "warn",

      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
      "unicorn/no-array-sort": "off",
      "unicorn/no-null": "warn",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/prevent-abbreviations": "warn"
    }
  },
  {
    files: ["eslint.config.js"],
    rules: {
      "import/default": "off",
      "import/namespace": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off"
    }
  }
]
