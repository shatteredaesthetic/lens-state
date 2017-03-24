const R = require('ramda');

const _extend = R.curry((extension, state) => {
  let added = {};
  Object.keys(extension).forEach(key => {
    if (!~Object.keys(state).indexOf(key)) {
      added[key] = extension[key];
    }
  });
  return Object.assign({}, state, added);
});

module.exports = stateLens;

function stateLens(state = {}) {
  const m = sLens(
    () => state,
    update => {
      state = update(state);
    },
    []
  );
  return {
    show,
    extend,
    evolve
  };

  function evolve(x, ...path) {
    const l = m.lens(path);
    return typeof x === 'function' ? l.over(x) : l.set(x);
  }

  function show(...path) {
    return m.lens(path).view();
  }

  function extend(extension, ...path) {
    return evolve(_extend(extension), path);
  }
}

function sLens(getter, setter, path) {
  path = _path(path);
  const focus = R.lensPath(_path(path));
  return {
    view,
    set,
    over,
    lens
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
  function lens(...path2) {
    path2 = _path(path2);
    return sLens(getter, setter, R.concat(path, path2));
  }
}

function _path(path) {
  return path.length > 1 && Array.isArray(path)
    ? path
    : typeof path[0] === 'number'
        ? path
        : typeof path[0] === 'string'
            ? path[0].split('.')
            : Array.isArray(path[0]) ? path[0] : path;
}
