/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "plugin:jsx-a11y/recommended", "prettier"],
  plugins: ["jsx-a11y"],
  rules: {
    "react-hooks/exhaustive-deps": "warn"
  }
};
