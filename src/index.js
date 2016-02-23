function observableMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    if (action.observable != null &&
      typeof action.observable.subscribe === 'function')
    {
      observable.subscribe(
        function onNext(data) {
          dispatch({ type: `${action.type}_ON_NEXT`, data });
        },
        function onError(err) {
          dispatch({ type: `${action.type}_ON_ERROR`, err });
        },
        function onCompleted() {
          dispatch({ type: `${action.type}_ON_COMPLETED` });
        }
      );
    }

    next(action);
  }
}

module.exports = observableMiddleware;
