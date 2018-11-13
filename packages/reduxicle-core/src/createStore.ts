import { applyMiddleware, compose, createStore as createReduxStore } from "redux";
import { AnyAction } from "redux";
import { Store, InjectedReducers, IReduxicleConfig, ReducerWrapper, IPluginContext, AnyReducer } from "./types";
import createSagaMiddleware from "redux-saga";
import { fromJS } from "immutable";
import { combineReducersAndWrappers } from "./utils";

const createStore = (config: IReduxicleConfig = {}): Store => {
  const reducerWrappers: ReducerWrapper[] = [];
  const injectedReducers: InjectedReducers = [];
  const sagaMiddleware = createSagaMiddleware();
  const plugins = config.plugins || [];
  const useImmutableJS = Boolean(config.useImmutableJS);

  let middlewares = [
    sagaMiddleware,
  ];

  const pluginContext: IPluginContext = {};
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

    if (plugin.reducerWrapper) {
      reducerWrappers.push(plugin.reducerWrapper);
    }

    if (plugin.key && plugin.context) {
      pluginContext[plugin.key] = plugin.context;
    }
  });
  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const combinedReducer = combineReducersAndWrappers(injectedReducers, reducerWrappers);
  const rootReducer = (state: any, action: any) => {
    let newState = state;
    if (config.superReducer) {
      newState = config.superReducer(newState, action);
    }
    newState = combinedReducer(newState, action);
    return newState;
  };

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancers =
    // It's fine to let users see their own data. However, we might want to add a config
    // option to show/hide dev tools in production
    // https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f
    // process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    (window as Window & { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as Window & { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false,
      })
      : compose;

  const enhancer = composeEnhancers(...enhancers);
  const store = createReduxStore(
    rootReducer,
    useImmutableJS ? fromJS({}) : {},
    enhancer,
  ) as Store;

  if (config.superSaga) {
    sagaMiddleware.run(config.superSaga);
  }

  store.reduxicle = {
    reducerWrappers,
    injectedReducers,
    injectedSagas: {},
    runSaga: sagaMiddleware.run,
    config,
    pluginContext,
  };

  return store;
};

export default createStore;
