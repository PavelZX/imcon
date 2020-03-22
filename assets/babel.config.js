module.exports = {
  presets: [
    [
      '@babel/preset-env',{ modules: false, "useBuiltIns": "entry", corejs: 3, "debug": true}
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    'styled-components',
    'transform-function-bind',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-numeric-separator',
    ['@babel/plugin-proposal-decorators', { "legacy": true }],
    ['@babel/plugin-proposal-class-properties', { "loose": true }]
  ],
  env: {
    production: {
      only: ['app'],
      plugins: [
        'lodash',
        'transform-react-remove-prop-types',
        '@babel/plugin-transform-react-inline-elements',
        '@babel/plugin-transform-react-constant-elements',
      ],
    },
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        'dynamic-import-node',
      ],
    },
  },
};
