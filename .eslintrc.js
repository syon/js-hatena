module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2018
  },
  extends: [
    "plugin:prettier/recommended"
  ],
  plugins: [
    "prettier"
  ],
  // add your custom rules here
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    //  'vue/max-attributes-per-line': 'off'
  }
};
