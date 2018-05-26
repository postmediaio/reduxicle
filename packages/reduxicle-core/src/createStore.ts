import { applyMiddleware, compose, createStore as createReduxStore } from "redux";
import { AnyAction } from "redux";
import { Store, InjectedReducers } from "./types";
import createSagaMiddleware from "redux-saga";
import { fromJS } from "immutable";
import { combineReducers } from "./utils";

const createStore = ({ immutable, plugins = [] }: { immutable?: boolean, plugins?: any[] } = {}): Store => {
  const injectedReducers: InjectedReducers = [];
  const sagaMiddleware = createSagaMiddleware();
  let middlewares = [
    sagaMiddleware,
  ];

  plugins.forEach((plugin) => {
    middlewares = middlewares.concat(plugin.middlewares);
    if (plugin.key && plugin.reducer) {
      const numDots = (plugin.key.match(/\./g) || []).length;
      if (!injectedReducers[numDots]) {
        injectedReducers[numDots] = {};
      }
  
      injectedReducers[numDots][plugin.key] = plugin.reducer;
    }
  });

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

  store.reduxicle = {
    injectedReducers,
    injectedSagas: {},
    runSaga: sagaMiddleware.run,
    immutable,
  }
  
  return store;
};

export default createStore;
