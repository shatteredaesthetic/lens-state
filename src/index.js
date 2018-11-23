const { lensProxy, over, set, view } = require("focused");

module.exports = function(initialState = {}) {
  let state = initialState;

  const obj = {
    _: lensProxy(),
    evolve: (lens, valOrFn) =>
      typeof valOrFn === "function"
        ? ((state = over(lens, valOrFn, state)), obj)
        : ((state = set(lens, valOrFn, state)), obj),
    view: lens => view(lens, state),
    extend: _extend
  };
  return obj;

  function _extend(extra) {
    if (typeof extra === "object") {
      state = Object.assign({}, state, extra);
      return obj;
    } else {
      throw new TypeError("the parameter must be an object");
      return obj;
    }
  }
};
