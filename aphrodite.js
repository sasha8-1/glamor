'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyleSheet = undefined;
exports.css = css;

var _index = require('./index.js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  console.warn('[Deprecation] In glamor v3 this file will be published as a standalone package: "glamor-aphrodite". See https://github.com/threepointone/glamor/issues/204 for more information.');
}

// todo
// - animations
// - fonts

var StyleSheet = exports.StyleSheet = {
  create: function create(spec) {
    return Object.keys(spec).reduce(function (o, name) {
      return o[name] = (0, _index.style)(spec[name]), o;
    }, {});
  }
};

function css() {
  for (var _len = arguments.length, rules = Array(_len), _key = 0; _key < _len; _key++) {
    rules[_key] = arguments[_key];
  }

  return _index.style.apply(undefined, _toConsumableArray(rules.filter(function (x) {
    return !!x;
  }))); // aphrodite compat https://github.com/threepointone/glamor/issues/170
}