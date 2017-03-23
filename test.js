import test from 'tape';
import spok from 'spok';
import stateLens from './src';

test('stateLens - simple state', t => {
  const state = stateLens({ x: 1 });
  const x = state.lens(['x']);
  t.equal(x.view(), 1);
  t.equal(state.look('x'), 1);

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
  const cLens = state.lens('c');
  const dLens = cLens.lens('d');

  t.equal(state.look('c.d'), 2);
  spok(t, cLens.view(), {
    inner: true,
    d: 2
  });

  t.equal(dLens.view(), 2);

  dLens.set(4);
  cLens.lens(['inner']).set(false);
  t.equal(state.look(['c', 'd']), 4);
  spok(t, cLens.view(), {
    inner: false,
    d: 4
  });

  dLens.over(n => n * 5);
  cLens.lens(['inner']).over(x => !x);
  t.equal(state.look('c.d'), 20);
  spok(t, cLens.view(), {
    inner: true,
    d: 20
  });

  const bLens = state.lens('b');
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
    e: [{ f: 6 }, { g: 7 }]
  });
  const cLens = state.lens('b.c');
  t.equal(cLens.view()[0], 2);
  t.equal(state.look(['b', 'c', 2]), 4);

  const fLens = state.lens('e', 0, 'f');
  t.equal(fLens.view(), 6);

  fLens.set(3);
  fLens.over(n => n * n);
  t.equal(fLens.view(), 9);
  t.equal(state.look('e', 1, 'g'), 7);

  t.end();
});

test('stateLens - extend', t => {
  const state = stateLens({});
  state.extend({ a: 1 });
  spok(t, state.view(), {
    a: 1
  });

  state.extend({ b: { c: 2 } });
  spok(t, state.view(), {
    a: 1,
    b: {
      c: 2
    }
  });

  const b = state.lens('b');
  spok(t, b.view(), {
    c: 2
  });

  b.extend({ d: 3, e: 4 });
  const d = b.lens('d');
  d.over(n => n * n);
  spok(t, b.view(), {
    c: 2,
    d: 9,
    e: 4
  });
  t.equal(b.look('e'), 4);

  t.end();
});
