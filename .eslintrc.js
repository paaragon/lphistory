module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-use-before-define': ['off'],
    'no-console': ['off'],
    'no-extend-native': ['off'],
    'no-underscore-dangle': ['off'],
    'no-unused-expressions': ['off'],
  },
};
