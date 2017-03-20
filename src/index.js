const R = require('ramda');

function lens(getter, setter, path) {
  const focus = R.lensPath(path);
  return {
    view: () => R.clone(R.view(focus, getter())),
    set: R.pipe(R.set(focus), setter),
    over: R.pipe(R.over(focus), setter),
    sub: path2 => lens(getter, setter, R.concat(path, path2))
  };
}

module.exports = function stateLens(state = {}) {
  return lens(
    () => state,
    update => { state = update(state); },
    []
  );
}
