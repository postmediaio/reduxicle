import { applyMiddleware, compose, createStore as createReduxStore } from "redux";
import { AnyAction } from "redux";
import { Store, InjectedReducers, IReduxicleConfig } from "./types";
import createSagaMiddleware from "redux-saga";
import { fromJS } from "immutable";
import { combineReducers } from "./utils";

const createStore = (config: IReduxicleConfig = {}): Store => {
  const injectedReducers: InjectedReducers = [];
  const sagaMiddleware = createSagaMiddleware();
  const plugins = config.plugins || [];
  const useImmutableJS = Boolean(config.useImmutableJS);

  let middlewares = [
    sagaMiddleware,
  ];

  plugins.forEach((plugin) => {
    /**
     * If the plugin has an initialize method, we want to call it
     * with the reduxicle config. This let's the plugin developer do
     * more configuration based on the global reduxicle config, not just
     * their own config
     */
    if (plugin.initialize) {
      const configWithoutPlugins = { ...config };
      delete configWithoutPlugins.plugins;
      
      plugin.initialize(configWithoutPlugins);
    }
    
    middlewares = middlewares.concat(plugin.middlewares || []);
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
  const composeEnhancers =
    process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    (window as Window & { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as Window & { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false,
      })
      : compose;

  const enhancer = composeEnhancers(...enhancers);
  const store = createReduxStore(
    combineReducers(injectedReducers),
    useImmutableJS ? fromJS({}) : {},
    enhancer,
  ) as Store;

  store.reduxicle = {
    injectedReducers,
    injectedSagas: {},
    runSaga: sagaMiddleware.run,
    config,
  }
  
  return store;
};

export default createStore;
