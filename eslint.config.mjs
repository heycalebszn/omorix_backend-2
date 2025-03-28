import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // ✅ Replaces `env: { node: true }`
      },
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "no-unused-vars": "warn",
    },
  },
  prettier,
];
