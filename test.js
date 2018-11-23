import test from "tape";
import spok from "spok";
import R from "ramda";
import stateLens from "./src";

test("stateLens - simple state", t => {
  const state = stateLens({ x: 1 });
  t.equal(state.goto("x").show(), 1);

  spok(t, state.show(), {
    x: 1
  });

  state.evolve(10);
  spok(t, state.show(), {
    x: 10
  });

  state.evolve(n => n / 5);
  spok(t, state.show(), {
    x: 2
  });
  t.end();
});

test("stateLens - nested state", t => {
  const state = stateLens({
    a: 1,
    b: "test",
    c: {
      inner: true,
      d: 2
    }
  });
  const lens1 = state.goto("c.d");
  const lens2 = state.goto("c.inner");

  t.equal(lens1.show(), 2);
  spok(t, state.goto("c").show(), {
    inner: true,
    d: 2
  });

  t.equal(lens1.show(), 2);

  lens1.evolve(4);
  lens2.evolve(false);
  t.equal(lens1.show(), 4);
  spok(t, state.goto("c").show(), {
    inner: false,
    d: 4
  });

  lens1.evolve(n => n * 5);
  lens2.evolve(x => !x);
  t.equal(lens1.show(), 20);
  spok(t, state.goto("c").show(), {
    inner: true,
    d: 20
  });

  state.lens("b").evolve(s => `${s}!`);
  t.equal(state.goto("b").show(), "test!");

  t.end();
});

test("stateLens - array access", t => {
  const state = stateLens({
    a: 1,
    b: {
      c: [2, 3, 4],
      d: 5
    },
    e: [{ f: 6 }, { g: 7 }]
  });
  t.equal(state.goto(["b", "c", 0]).show(), 2);
  t.equal(state.goto(["b", "c", 2]).show(), 4);

  const lens3 = state.goto(["e", 0, "f"]);
  t.equal(lens3.show(), 6);

  lens3.evolve(3).evolve(n => n * n);
  t.equal(lens3.show(), 9);
  t.equal(state.goto(["e", 1, "g"]).show(), 7);

  t.end();
});

test("stateLens - extend", t => {
  const state = stateLens();
  state.extend({ a: 1 });
  spok(t, state.show(), {
    a: 1
  });

  state.extend({ b: { c: 2 } });
  spok(t, state.show(), {
    a: 1,
    b: {
      c: 2
    }
  });

  spok(t, state.goto("b").show(), {
    c: 2
  });

  const lens4 = state.goto("b");
  lens4
    .extend({ d: 3, e: 4 })
    .goto("d")
    .evolve(n => n * n);
  spok(t, lens4.show(), {
    c: 2,
    d: 9,
    e: 4
  });
  t.equal(state.goto("b.e").show(), 4);

  t.end();
});
