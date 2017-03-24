'use strict';

var R = require('ramda');

var _extend = R.curry(function (extension, state) {
  var added = {};
  Object.keys(extension).forEach(function (key) {
    if (!~Object.keys(state).indexOf(key)) {
      added[key] = extension[key];
    }
  });
  return Object.assign({}, state, added);
});

module.exports = stateLens;

function stateLens() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var m = sLens(function () {
    return state;
  }, function (update) {
    state = update(state);
  }, []);
  return {
    show: show,
    extend: extend,
    evolve: evolve
  };

  function evolve(x) {
    for (var _len = arguments.length, path = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      path[_key - 1] = arguments[_key];
    }

    var l = m.lens(path);
    return typeof x === 'function' ? l.over(x) : l.set(x);
  }

  function show() {
    for (var _len2 = arguments.length, path = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      path[_key2] = arguments[_key2];
    }

    return m.lens(path).view();
  }

  function extend(extension) {
    for (var _len3 = arguments.length, path = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      path[_key3 - 1] = arguments[_key3];
    }

    return evolve(_extend(extension), path);
  }
}

function sLens(getter, setter, path) {
  path = _path(path);
  var focus = R.lensPath(_path(path));
  return {
    view: view,
    set: set,
    over: over,
    lens: lens
  };

  function view() {
    return R.clone(R.view(focus, getter()));
  }
  function set(value) {
    return R.pipe(R.set(focus), setter)(value);
  }
  function over(fn) {
    return R.pipe(R.over(focus), setter)(fn);
  }
  function lens() {
    for (var _len4 = arguments.length, path2 = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      path2[_key4] = arguments[_key4];
    }

    path2 = _path(path2);
    return sLens(getter, setter, R.concat(path, path2));
  }
}

function _path(path) {
  return path.length > 1 && Array.isArray(path) ? path : typeof path[0] === 'number' ? path : typeof path[0] === 'string' ? path[0].split('.') : Array.isArray(path[0]) ? path[0] : path;
}