# LensState

### This is a major breaking change to the API, as in it's completely different. Shouldn't change too much now, though

LensState is a tiny lib that uses the `focused` library to provide an encapsulated state, with mutations controlled through lenses.

## Installation

Install via npm

```
npm i -S lens-state
```

### Usage

LensState provides a single constructor function which takes one parameter, an initial state object, defaulted to an empty object.

#### Example

```
var statelens = require('lens-state');

const { _, evolve, extend, view } = statelens({a: {b: 0}});

// immutable read
console.log(view(_.a.b)) // 0

evolve(_.a.b, 10);
console.log(view(_.a.b)) // 10

evolve(_.a.b, n => n + 1);
console.log(view(_.a.b)) // 11

//extend state
extend({ c: [7, 8, 9] });
console.log(view(_.c[2])) // 9

//methods are chainable
extend({ e: null }).evolve(_.e, 9).evolve(_.e, Math.sqrt)
console.log(view(_.e))  // 3
```

## API

### const { \_, evolve, extend, view } = stateLens(stateObj);

Sets the state to the `stateObj`. The provided constructor returns an object with our getter (`view`), our setter (`evolve`), a lensProzy saved under `_`, and a way to `extend` the state.

### \_

Used to create lenses into the state object. For more information on creating lenses, please see the `focused` [documentation](https://github.com/yelouafi/focused).

### evolve(lens, valOrFn)

If `valOrFn` is a value, replaces the focus of the current `lens` with the provided value.

If `valOrFn` is a function, passes the focused portion of the current `lens` to the provided function, replacing it with the result.

### view(lens)

Returns a deep copy of the `lens` into the current state.

### extend(extObject)

Takes an object (`extObject`) of new key/value pairs, and adds it to the state. Returns a TypeError if `extObject` isn't an object.

---

_heavily inspired by:_

- _beezee's [statelens](https://github.com/beezee/statelens)_
- _yelouafi's [focused](https://github.com/yelouafi/focused)_
