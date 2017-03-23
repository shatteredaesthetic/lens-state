const R = require('ramda');

module.exports = stateLens;

function stateLens(state = {}) {
  return sLens(
    () => state,
    update => {
      state = update(state);
    },
    extend,
    []
  );
}

function sLens(getter, setter, adder, path) {
  path = _path(path);
  const focus = R.lensPath(path);
  return {
    view,
    look,
    set,
    over,
    lens,
    extend
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

const extend = R.curry((extension, state) => {
  let added = {};
  Object.keys(extension).forEach(key => {
    if (!~Object.keys(state).indexOf(key)) {
      added[key] = extension[key];
    }
  });
  return Object.assign({}, state, added);
});

function _path(path) {
  return Array.isArray(path) ? path : R.split('.', path);
}
