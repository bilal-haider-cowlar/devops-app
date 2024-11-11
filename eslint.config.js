const globals = require("globals");
const prettierPlugin = require("eslint-plugin-prettier");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2022,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      // Errors
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-dupe-class-members": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-case": "error",
      "no-duplicate-imports": "error",
      "default-param-last": "error",
      "no-sequences": "error",
      "no-prototype-builtins": "error",
      "brace-style": "error",
      "no-unused-expressions": "error",
      "no-undef": "error",
      "no-redeclare": "error",
      "no-var": "error",
      "no-empty": "error",
      "array-callback-return": "error",
      "constructor-super": "error",
      "for-direction": "error",
      "no-cond-assign": "error",
      "no-const-assign": "error",
      "no-constant-condition": "error",
      "no-constant-binary-expression": "error",
      "no-ex-assign": "error",
      "valid-typeof": "error",
      "use-isnan": "error",
      "no-use-before-define": "error",

      // Warnings
      "no-inner-declarations": "warn",
      "unused-imports/no-unused-vars": "warn",
      "unused-imports/no-unused-imports": "warn",

      // Prettier formatting rules
      "prettier/prettier": ["error", { parser: "flow" }],

      // Off
      eqeqeq: "off",
      "no-throw-literal": "off",
      camelcase: "off",
      "no-async-promise-executor": "off",
      "prefer-promise-reject-errors": "off",
    },
  },
];
