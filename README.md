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
bLens = state.lens(["a", "b"]);
console.log(bLens.view()) // 0

bLens.set(10)
console.log(bLens.view()) // 10
console.log(state.look(['a', 'b'])) // 10

bLens.over(n => n + 1);
console.log(bLens.view()) // 11

//extend state
state.extend({ c: 1 });
console.log(state.look(['c'])) // 1

//extend doesn't overwrite existing keys
state.extend({ a:false, d:2 });
console.log(state.look(['a'])) // { b: 11 }
```

## API

### const state = StateLens(stateObj);

(A) -> StateLens

Sets the state to the `stateObj`. The provided constructor returns a lens object with four functions on it.

### state.set(x)

(A) -> void

Replaces the focus of the current lens with the provided value `x`, and passes the resulting state to the lenses Setter.

### state.over(f)

(Focus -> A) -> void

Takes a function `f` from focused portion of the current state to a new value.

Passes the focused portion of the current state to the provided function `f`, replaces the focus of the current state with the result, and passes the resulting state to the lenses Setter.

### state.view()

() -> Focus

Returns a deep copy of the focused portion of the current state.

### state.lens(path)

([number | string]) -> StateLens

Takes a new focus parameter, and returns a new lens focused on the concatenation of the original lenses path with the newly provided `path`.

### state.extend(extObject)

(object) -> void

Takes an object (`extObject`) of new key/value pairs, and adds it to the state at the level of the lens. Does not overwrite existing keys.

___
*heavily inspired by beezee's [statelens](https://github.com/beezee/statelens)*
