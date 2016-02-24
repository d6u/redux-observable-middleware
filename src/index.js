const getType = require('./util').getType;

function observableMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    if (action.observable != null &&
      typeof action.observable.subscribe === 'function')
    {
      const ON_SUBSCRIBE_TYPE = getType(action.type, 'onSubscribe', '');
      const ON_NEXT_TYPE = getType(action.type, 'onNext', `_ON_NEXT`);
      const ON_ERROR_TYPE = getType(action.type, 'onError', `_ON_ERROR`);;
      const ON_COMPLETED_TYPE = getType(action.type, 'onCompleted', `_ON_COMPLETED`);;

      action.observable.subscribe(
        ON_NEXT_TYPE && function onNext(data) {
          dispatch({ type: ON_NEXT_TYPE, data });
        },
        ON_ERROR_TYPE && function onError(err) {
          dispatch({ type: ON_ERROR_TYPE, err });
        },
        ON_COMPLETED_TYPE && function onCompleted() {
          dispatch({ type: ON_COMPLETED_TYPE });
        }
      );

      if (ON_SUBSCRIBE_TYPE != null) {
        const actionClone = Object.assign({}, action);
        actionClone.type = ON_SUBSCRIBE_TYPE;
        next(actionClone);
      }
    } else {
      next(action);
    }
  }
}

module.exports = observableMiddleware;
