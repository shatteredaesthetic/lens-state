import * as R from "ramda";
import { propPath, Maybe } from "crocks";
const { Just, Nothing } = Maybe;

const parsePath = path => {
  const _path = typeof path === string ? path.split(".") : path;
  return propPath(_path);
};

const _extend = R.curry((extension, state) => {
  return Object.entries(extension).reduce(
    ([k, v], acc) => (state.hasOwnProperty(k) ? R.merge(acc, { k: v }) : {}),
    {}
  );
});

function sLens(getter, setter, path) {
  let _path = parsePath(path).option([]);
  if (_path.length === 0) {
    throw new TypeError("Path: your path doesn't exist on the state.");
  }
  const focus = R.lensPath(_path);
  return {
    view: () => R.clone(R.view(focus, getter())),
    set: value =>
      R.pipe(
        R.set(focus),
        setter
      )(value),
    over: fn =>
      R.pipe(
        R.over(focus),
        setter
      )(fn),
    lens: path2 => {
      let _path2 = parsePath(path2).option([]);
      if (_path.length === 0) {
        throw new TypeError("Path: your path doesn't exist on the state.");
      }
      return sLens(getter, setter, R.concat(path, path2));
    }
  };
}

function stateLens(state = {}) {
  const m = sLens(
    () => state,
    update => {
      state = update(state);
    },
    []
  );

  const returnObj = {
    show: () => m.view(),
    goto: path => m.lens(path),
    extend: extension => evolve(_extend(extension)),
    evolve: x => (typeof x === "function" ? m.over(x) : m.set(x), returnObj)
  };
}
