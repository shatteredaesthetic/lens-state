'use strict';

var R = require('ramda');

function lens(getter, setter, path) {
  var focus = R.lensPath(path);
  return {
    view: function view() {
      return R.clone(R.view(focus, getter()));
    },
    set: R.pipe(R.set(focus), setter),
    over: R.pipe(R.over(focus), setter),
    sub: function sub(path2) {
      return lens(getter, setter, R.concat(path, path2));
    }
  };
}

module.exports = function stateLens() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return lens(function () {
    return state;
  }, function (update) {
    state = update(state);
  }, []);
};