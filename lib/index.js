"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require("focused"),
    lensProxy = _require.lensProxy,
    over = _require.over,
    set = _require.set,
    _view = _require.view;

module.exports = function () {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var state = initialState;

  var obj = {
    _: lensProxy(),
    evolve: function evolve(lens, valOrFn) {
      return typeof valOrFn === "function" ? (state = over(lens, valOrFn, state), obj) : (state = set(lens, valOrFn, state), obj);
    },
    view: function view(lens) {
      return _view(lens, state);
    },
    extend: _extend
  };
  return obj;

  function _extend(extra) {
    if ((typeof extra === "undefined" ? "undefined" : _typeof(extra)) === "object") {
      state = Object.assign({}, state, extra);
      return obj;
    } else {
      throw new TypeError("the parameter must be an object");
      return obj;
    }
  }
};