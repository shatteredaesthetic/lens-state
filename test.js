import test from "tape";
import spok from "spok";
import stateLens from "./src";

test("stateLens - simple state", t => {
  const { _, evolve, view } = stateLens({ x: 1 });
  t.equal(view(_.x), 1);

  spok(t, view(_), {
    x: 1
  });

  evolve(_.x, 10);
  spok(t, view(_), {
    x: 10
  });

  evolve(_.x, n => n / 5);
  spok(t, view(_), {
    x: 2
  });
  t.end();
});

test("stateLens - nested state", t => {
  const { _, view, evolve } = stateLens({
    a: 1,
    b: "test",
    c: {
      inner: true,
      d: 2
    }
  });

  t.equal(view(_.c.d), 2);
  spok(t, view(_.c), {
    inner: true,
    d: 2
  });

  evolve(_.c.d, 4);
  evolve(_.c.inner, false);
  t.equal(view(_.c.d), 4);
  spok(t, view(_.c), {
    inner: false,
    d: 4
  });

  evolve(_.c.d, n => n * 5);
  evolve(_.c.inner, x => !x);
  t.equal(view(_.c.d), 20);
  spok(t, view(_.c), {
    inner: true,
    d: 20
  });

  evolve(_.b, s => `${s}!`);
  t.equal(view(_.b), "test!");

  t.end();
});

test("stateLens - array access", t => {
  const { _, evolve, view } = stateLens({
    a: 1,
    b: {
      c: [2, 3, 4],
      d: 5
    },
    e: [{ f: 6 }, { g: 7 }]
  });
  t.equal(view(_.b.c[0]), 2);
  t.equal(view(_.b.c[2]), 4);

  const lens3 = _.e[0].f;
  t.equal(view(lens3), 6);

  evolve(lens3, 3).evolve(lens3, n => n * n);
  t.equal(view(lens3), 9);
  t.equal(view(_.e[1].g), 7);

  t.end();
});

test("stateLens - extend", t => {
  const { _, extend, evolve, view } = stateLens();
  extend({ a: 1 });
  spok(t, view(_), {
    a: 1
  });

  extend({ b: { c: 2 } });
  spok(t, view(_), {
    a: 1,
    b: {
      c: 2
    }
  });

  spok(t, view(_.b), {
    c: 2
  });

  evolve(_.b, b => Object.assign({}, b, { d: 3, e: 4 }));
  evolve(_.b.d, n => n * n);
  spok(t, view(_.b), {
    c: 2,
    d: 9,
    e: 4
  });
  t.equal(view(_.b.e), 4);

  t.end();
});
