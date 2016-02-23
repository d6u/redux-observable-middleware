# Redux Observable Middleware

Redux middleware for subscribing to observables in action creators.

## Usage

Checkout `demo` or read below.

```js
import observableMiddleware from 'redux-observable-middleware';

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
```

It's very simple, the middleware will attempt to subscribe to any object with a `subscribe` method on it. :bowtie:

## API

Use redux-observable-middleware just like you would with any other Redux middleware.

```js
import { createStore, applyMiddleware } from 'redux';
import observableMiddleware from 'redux-observable-middleware';

const store = createStore(
  reducer,
  applyMiddleware(observableMiddleware));
```

In your action creator, your action need to have two properties:

- `type: string|object` 
    - If `type` is a string, it will dispatch four different actions. Assuming the string is 'ACTION_A', action type will be:
        - `ACTION_A` immediately
        - `ACTION_A_ON_NEXT`
        - `ACTION_A_ON_ERROR`
        - `ACTION_A_ON_COMPLETED`
    - If `type` is an object, it will look for keys to specify action types:
        - `onSubscribe`
        - `onNext`
        - `onError`
        - `onCompleted`
    - When `type` is an object, any action type with an unspecified key will be ignored. E.g. if you only define `onNext`, the other three action will never be dispatched.
- `observable: Observable` can be any object with a `subscribe` method on it.

### Action object structure

- `onSubscribe` action type, object will have all original object properties, including the `observable` property, except for `type` property. If `type` is an object. It will be replaced with the `value` on `type.onSubscribe`
- `onNext` action type, object will have `data` and `type` properties.
- `onError` action type, object will have `err` and `type` properties.
- `onCompleted` action type, object will only have `type` property.
