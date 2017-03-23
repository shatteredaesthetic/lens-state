'use strict';

var R = require('ramda');

module.exports = stateLens;

function stateLens() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return sLens(function () {
    return state;
  }, function (update) {
    state = update(state);
  }, extend, []);
}

function sLens(getter, setter, adder, path) {
  path = _path(path);
  var focus = R.lensPath(path);
  return {
    view: view,
    look: look,
    set: set,
    over: over,
    lens: lens,
    extend: extend
  };

  function view() {
    return R.clone(R.view(focus, getter()));
  }
  function look(path2) {
    path2 = _path(path2);
    return R.clone(R.view(R.lensPath(R.concat(path, path2)), getter()));
  }
  function set(value) {
    return R.pipe(R.set(focus), setter)(value);
  }
  function over(fn) {
    return R.pipe(R.over(focus), setter)(fn);
  }
  function lens(path2) {
    path2 = _path(path2);
    return sLens(getter, setter, adder, R.concat(path, path2));
  }
  function extend(extension) {
    return over(adder(extension));
  }
}

var extend = R.curry(function (extension, state) {
  var added = {};
  Object.keys(extension).forEach(function (key) {
    if (!~Object.keys(state).indexOf(key)) {
      added[key] = extension[key];
    }
  });
  return Object.assign({}, state, added);
});

function _path(path) {
  return Array.isArray(path) ? path : R.split('.', path);
}