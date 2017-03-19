'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stateLens;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lens(getter, setter, path) {
  var focus = _ramda2.default.lensPath(path);
  return {
    view: function view() {
      return _ramda2.default.clone(_ramda2.default.view(focus, getter()));
    },
    set: _ramda2.default.pipe(_ramda2.default.set(focus), setter),
    over: _ramda2.default.pipe(_ramda2.default.over(focus), setter),
    sub: function sub(path2) {
      return lens(getter, setter, _ramda2.default.concat(path, path2));
    }
  };
}

function stateLens() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return lens(function () {
    return state;
  }, function (update) {
    state = update(state);
  }, []);
}