// import { combineReducers } from "redux";
import { combineReducers } from './utils';
import { AnyFunction, AnyReducer, SagaInjectionModes, Store, InjectedSagaDescriptor } from "./types";

export interface IInjectReducer {
  key: string;
  reducer: AnyReducer;
  store: Store;
}

export const injectReducer = ({ key, reducer, store }: IInjectReducer) => {
  /**
   * So the issue here is that reducers need to be ran in a certain order.
   * Reducers with more dots in their name (more deeply nested) need to be ran
   * after reducers with less dots in their name. This is so reducers don't
   * replace the state of deeper reducers.
   * 
   * We can assume that reducers get ran more often than they're injected, so we should 
   * make the running efficent and do a little more work for the insertion. We can do our 
   * sort/organization on the injection here then instead of where we run them. 
   * 
   * The idea is to store the reducers as an array of objects, where each subsequent object
   * in the array is for reducers with one more dot in the key. This way, we can communicate
   * to the store replacer which reducers should get run in what order.
   */
  const numDots = (key.match(/\./g) || []).length;
  if (!store.reduxicle.injectedReducers[numDots]) {
    store.reduxicle.injectedReducers[numDots] = {};
  }

  store.reduxicle.injectedReducers[numDots][key] = reducer;
  store.replaceReducer(combineReducers(store.reduxicle.injectedReducers));

  // Need to dispatch an action so that the reducers re-trigger
  store.dispatch({ type: "@@reduxicle/inject-reducer", key });
};

export interface IInjectSaga {
  key: string;
  saga: AnyFunction;
  mode: SagaInjectionModes;
  store: Store;
}

export const injectSaga = ({ key, saga, mode = SagaInjectionModes.RESTART_ON_REMOUNT, store }: IInjectSaga) => {
  const oldDescriptor = store.reduxicle.injectedSagas[key];
  let hasSaga = Boolean(oldDescriptor);

  if (process.env.NODE_ENV !== "production") {
    // enable hot reloading of daemon and once-till-unmount sagas
    if (hasSaga && oldDescriptor.saga !== saga) {
      oldDescriptor.task.cancel();
      hasSaga = false;
    }
  }

  if (!hasSaga || (hasSaga && mode !== SagaInjectionModes.DAEMON && mode !== SagaInjectionModes.ONCE_TILL_UNMOUNT)) {
    store.reduxicle.injectedSagas[key] = {
      mode,
      saga,
      task: store.reduxicle.runSaga(saga),
    };
  }
};

export interface IEjectSaga {
  key: string;
  store: Store;
}

export const ejectSaga = ({ key, store }: IEjectSaga) => {
  const descriptor = store.reduxicle.injectedSagas[key];
  const hasSaga = Boolean(descriptor);

  if (hasSaga) {
    if (descriptor.mode !== SagaInjectionModes.DAEMON) {
      descriptor.task.cancel();
      // Clean up in production; in development we need `descriptor.saga` for hot reloading
      if (process.env.NODE_ENV === "production") {
        // Need some value to be able to detect `ONCE_TILL_UNMOUNT` sagas in `injectSaga`
        store.reduxicle.injectedSagas[key] = 'done'; // eslint-disable-line no-param-reassign
      }
    }
  }
};
