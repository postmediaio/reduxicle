import { applyMiddleware, compose, createStore as createReduxStore } from "redux";
import { AnyAction } from "redux";
import { Store } from './types';
import createSagaMiddleware from "redux-saga";
import { fromJS } from "immutable";

const createStore = ({ immutable }: { immutable?: boolean } = {}): Store => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    sagaMiddleware,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    (window as Window & { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as Window & { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false,
      })
      : compose;
  /* eslint-enable */

  const enhancer = composeEnhancers(...enhancers);
  const store = createReduxStore(() => (immutable ? fromJS({}) : {}), immutable ? fromJS({}) : {}, enhancer) as Store;

  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry
  
  return store;
};

export default createStore;
