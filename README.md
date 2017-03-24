# LensState

LensState is a tiny lib that uses the `Ramda` library, to provide a lens structure that is useful for state manipulations.

## Installation

Install via npm

```
npm i -S lens-state
```
### Usage

LensState provides a single constructor function which takes one parameter, an initial state object.

#### Example

```
var statelens = require('lens-state');

var state = statelens({a: {b: 0}});

// immutable read
console.log(state.show('a.b')) // 0

state.evolve(10, 'a.b');
console.log(state.show('a.b')) // 10

state.evolve(n => n + 1, 'a.b');
console.log(state.show('a.b')) // 11

//extend state
state.extend({ c: [7, 8, 9] });
console.log(state.show('c', 2)) // 9

//extend doesn't overwrite existing keys
state.extend({ a:false, d:2 });
console.log(state.show('a')) // { b: 11 }
```

## API

### const S = stateLens(stateObj);

(A) -> StateLens

Sets the state to the `stateObj`. The provided constructor returns a lens object with four functions on it.

### S.evolve(x, path)

(A | Fn, ...[number | string]) -> void

If `x` is a value, replaces the focus of the current lens at the `path` with the provided value `x`, and passes the resulting state to the lenses Setter.

If `x` is a function, passes the focused portion of the current `path` to the provided function `x`, replaces the focus of the current `path` with the result, and passes the resulting state to the lenses Setter.

### S.show(path)

(...[number | string]) -> Focus

Returns a deep copy of the focused portion, plus the `path`, of the current state.

A single string can be multiple keys seperated by a `.`.

### S.extend(extObject, path)

(object, ...[number | string]) -> void

Takes an object (`extObject`) of new key/value pairs, and adds it to the state at the level of the `path`. Does not overwrite existing keys.

___
*heavily inspired by beezee's [statelens](https://github.com/beezee/statelens)*
