import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended, // React rules merged here
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Include Node globals for backend code
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: pluginReact,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off", // Disable outdated rule
      "react/prop-types": "off", // Disable if using TS or PropTypes not needed
      "no-unused-vars": "warn",
      "no-console": "off",
    },
    settings: {
      react: { version: "detect" }, // Auto-detect React version
    },
  },
]);
