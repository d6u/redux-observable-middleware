const test = require('tape');
const Redux = require('redux');
const observableMiddleware = require('../src');
const Rx = require('rx');

const ACTION_TYPE = 'INTERVAL';

test('uses interpolated action type', function (t) {
  t.plan(8);
  const obs = Rx.Observable.interval(100).take(2);
  const reducerExpectation = [
    { type: ACTION_TYPE, observable: obs },
    { type: `${ACTION_TYPE}_ON_NEXT`, data: 0 },
    { type: `${ACTION_TYPE}_ON_NEXT`, data: 1 },
    { type: `${ACTION_TYPE}_ON_COMPLETED` },
  ];
  const subExpectation = [null, 0, 1, 100];

  function reducer(state = null, action) {

    if (action.type !== '@@redux/INIT') {
      t.deepLooseEqual(action, reducerExpectation.shift());
    }

    switch (action.type) {
    case `${ACTION_TYPE}_ON_NEXT`:
      return action.data;
    case `${ACTION_TYPE}_ON_ERROR`:
      return state;
    case `${ACTION_TYPE}_ON_COMPLETED`:
      return 100;
    default:
      return state;
    }
  }

  const store = Redux.createStore(reducer, Redux.applyMiddleware(observableMiddleware));
  store.subscribe(() => {
    t.equal(store.getState(), subExpectation.shift());
  });

  store.dispatch({
    type: ACTION_TYPE,
    observable: obs,
  });
});

test('uses customized action type', function (t) {
  t.plan(8);
  const obs = Rx.Observable.interval(100).take(2);
  const reducerExpectation = [
    { type: 'SUB', observable: obs },
    { type: 'YO', data: 0 },
    { type: 'YO', data: 1 },
    { type: 'DONE' },
  ];
  const subExpectation = [null, 0, 1, 100];

  function reducer(state = null, action) {

    if (action.type !== '@@redux/INIT') {
      t.deepLooseEqual(action, reducerExpectation.shift());
    }

    switch (action.type) {
    case 'YO':
      return action.data;
    case 'OOPS':
      return state;
    case 'DONE':
      return 100;
    default:
      return state;
    }
  }

  const store = Redux.createStore(reducer, Redux.applyMiddleware(observableMiddleware));
  store.subscribe(() => {
    t.equal(store.getState(), subExpectation.shift());
  });

  store.dispatch({
    type: {
      onSubscribe: 'SUB',
      onNext: 'YO',
      onError: 'OOPS',
      onCompleted: 'DONE',
    },
    observable: obs,
  });
});

test('ignores unspecified type', function (t) {
  t.plan(4);
  const obs = Rx.Observable.interval(100).take(2);
  const reducerExpectation = [
    { type: 'SUB', observable: obs },
    { type: 'DONE' },
  ];
  const subExpectation = [null, 100];

  function reducer(state = null, action) {

    if (action.type !== '@@redux/INIT') {
      t.deepLooseEqual(action, reducerExpectation.shift());
    }

    switch (action.type) {
    case 'YO':
      return action.data;
    case 'OOPS':
      return state;
    case 'DONE':
      return 100;
    default:
      return state;
    }
  }

  const store = Redux.createStore(reducer, Redux.applyMiddleware(observableMiddleware));
  store.subscribe(() => {
    t.equal(store.getState(), subExpectation.shift());
  });

  store.dispatch({
    type: {
      onSubscribe: 'SUB',
      onError: 'OOPS',
      onCompleted: 'DONE',
    },
    observable: obs,
  });
});

test('always sends onSubscribe action first', function (t) {
  t.plan(4);
  const obs = Rx.Observable.from([0, 1]);
  const reducerExpectation = [
    { type: 'SUB', observable: obs },
    { type: 'DONE' },
  ];
  const subExpectation = [null, 100];

  function reducer(state = null, action) {

    if (action.type !== '@@redux/INIT') {
      t.deepLooseEqual(action, reducerExpectation.shift());
    }

    switch (action.type) {
    case 'YO':
      return action.data;
    case 'OOPS':
      return state;
    case 'DONE':
      return 100;
    default:
      return state;
    }
  }

  const store = Redux.createStore(reducer, Redux.applyMiddleware(observableMiddleware));
  store.subscribe(() => {
    t.equal(store.getState(), subExpectation.shift());
  });

  store.dispatch({
    type: {
      onSubscribe: 'SUB',
      onError: 'OOPS',
      onCompleted: 'DONE',
    },
    observable: obs,
  });
});
