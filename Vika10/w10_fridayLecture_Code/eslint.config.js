const node = require("eslint-plugin-n");
const globals = require("globals");

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    plugins: {
      n: node,
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "arrow-body-style": ["error", "as-needed"],
      "prefer-arrow-callback": "error",
      "n/no-unsupported-features/es-syntax": ["error", { version: ">=14.0.0" }],
      "n/no-missing-import": "error",
      "n/no-unpublished-import": "off",
      "n/no-unpublished-require": "off",
      "n/no-extraneous-import": "off",
      "n/no-extraneous-require": "off",
      "n/no-missing-require": [
        "error",
        { tryExtensions: [".js", ".json", ".node"] },
      ],
    },
  },
];
