module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': [0],
    'func-names': ['error', 'always', { 'generators': 'never' }],
    'import/prefer-default-export': [0],
    'no-param-reassign': [0],
    'arrow-parens': [0]
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
