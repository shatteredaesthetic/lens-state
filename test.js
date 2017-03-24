import test from 'tape';
import spok from 'spok';
import stateLens from './src';

test('stateLens - simple state', t => {
  const state = stateLens({ x: 1 });
  t.equal(state.show('x'), 1);

  spok(t, state.show(), {
    x: 1
  });

  state.evolve(10, 'x');
  spok(t, state.show(), {
    x: 10
  });

  state.evolve(n => n / 5, 'x');
  spok(t, state.show(), {
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

  t.equal(state.show('c.d'), 2);
  spok(t, state.show('c'), {
    inner: true,
    d: 2
  });

  t.equal(state.show('c.d'), 2);

  state.evolve(4, 'c.d');
  state.evolve(false, 'c.inner');
  t.equal(state.show('c.d'), 4);
  spok(t, state.show('c'), {
    inner: false,
    d: 4
  });

  state.evolve(n => n * 5, 'c.d');
  state.evolve(x => !x, 'c.inner');
  t.equal(state.show('c.d'), 20);
  spok(t, state.show('c'), {
    inner: true,
    d: 20
  });

  state.evolve(s => `${s}!`, 'b');
  t.equal(state.show('b'), 'test!');

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
  t.equal(state.show('b', 'c', 0), 2);
  t.equal(state.show('b', 'c', 2), 4);

  const fLens = ['e', 0, 'f'];
  t.equal(state.show(fLens), 6);

  state.evolve(3, fLens);
  state.evolve(n => n * n, fLens);
  t.equal(state.show(fLens), 9);
  t.equal(state.show('e', 1, 'g'), 7);

  t.end();
});

test('stateLens - extend', t => {
  const state = stateLens({});
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

  spok(t, state.show('b'), {
    c: 2
  });

  state.extend({ d: 3, e: 4 }, 'b');
  state.evolve(n => n * n, 'b.d');
  spok(t, state.show('b'), {
    c: 2,
    d: 9,
    e: 4
  });
  t.equal(state.show('b.e'), 4);

  t.end();
});
