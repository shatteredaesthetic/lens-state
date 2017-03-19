import test from 'tape';
import spok from 'spok';
import stateLens from './src';

test('stateLens - simple state', t => {
  const state = stateLens({ x: 1 });
  const x = state.sub(["x"]);
  t.equal(x.view(), 1);

  spok(t, state.view(), {
    x: 1
  });

  x.set(10);
  spok(t, state.view(), {
    x: 10
  });

  x.over(n => n / 5);
  spok(t, state.view(), {
    x: 2
  });
  t.end();
});

test('stateLens - nested state', t => {
  const state = stateLens({
    a: 1,
    b: 'test',
    c: {
      inner: true,
      d: 2
    }
  });
  const cLens = state.sub(["c"]);
  const dLens = cLens.sub(["d"]);

  spok(t, cLens.view(), {
    inner: true,
    d: 2
  });

  t.equal(dLens.view(), 2);

  dLens.set(4);
  cLens.sub(["inner"]).set(false);
  spok(t, cLens.view(), {
    inner: false,
    d:4
  });

  dLens.over(n => n * 5);
  cLens.sub(["inner"]).over(x => !x);
  spok(t, cLens.view(), {
    inner: true,
    d: 20
  });

  const bLens = state.sub(["b"]);
  bLens.over(s => `${s}!`);
  t.equal(bLens.view(), 'test!');

  t.end();
});

test('stateLens - array access', t => {
  const state = stateLens({
    a: 1,
    b: {
      c: [2, 3, 4],
      d: 5
    },
    e: [
      { f: 6 },
      { g: 7 }
    ]
  });
  const cLens = state.sub(["b", "c"]);
  t.equal(cLens.view()[0], 2);

  const fLens = state.sub(["e", 0, "f"]);
  t.equal(fLens.view(), 6);

  fLens.set(3);
  fLens.over(n => n * n);
  t.equal(fLens.view(), 9);

  t.end();
});
