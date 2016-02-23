import observableMiddleware from '../src/index';

const ACTION_TYPE = 'INTERVAL';

function reducer(state = null, action) {
  console.log(action);
  switch (action.type) {
  case `${ACTION_TYPE}_ON_NEXT`:
    return action.data;
  case `${ACTION_TYPE}_ON_ERROR`:
    return state;
  case `${ACTION_TYPE}_ON_COMPLETED`:
    return state;
  default:
    return state;
  }
}

const store = Redux.createStore(reducer, Redux.applyMiddleware(observableMiddleware));

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch({
  type: ACTION_TYPE,
  observable: Rx.Observable.interval(1000).take(5),
});
