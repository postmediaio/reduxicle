// import { combineReducers } from "redux";
import { combineReducers } from './utils';
import { AnyFunction, AnyReducer, SagaInjectionModes, Store, InjectedSagaDescriptor } from "./types";

export interface IInjectReducer {
  key: string;
  reducer: AnyReducer;
  store: Store;
}

export const injectReducer = ({ key, reducer, store }: IInjectReducer) => {
  store.injectedReducers[key] = reducer;
  store.replaceReducer(combineReducers(store.injectedReducers));

  // Need to dispatch an action so that the reducers re-trigger
  store.dispatch({ type: "@@reduxicle/inject-reducer" });
};

export interface IInjectSaga {
  key: string;
  saga: AnyFunction;
  mode: SagaInjectionModes;
  store: Store;
}

export const injectSaga = ({ key, saga, mode = SagaInjectionModes.RESTART_ON_REMOUNT, store }: IInjectSaga) => {
  const oldDescriptor = store.injectedSagas[key];
  let hasSaga = Boolean(oldDescriptor);

  if (process.env.NODE_ENV !== "production") {
    // enable hot reloading of daemon and once-till-unmount sagas
    if (hasSaga && oldDescriptor.saga !== saga) {
      oldDescriptor.task.cancel();
      hasSaga = false;
    }
  }

  if (!hasSaga || (hasSaga && mode !== SagaInjectionModes.DAEMON && mode !== SagaInjectionModes.ONCE_TILL_UNMOUNT)) {
    store.injectedSagas[key] = {
      mode,
      saga,
      task: store.runSaga(saga),
    };
  }
};

export interface IEjectSaga {
  key: string;
  store: Store;
}

export const ejectSaga = ({ key, store }: IEjectSaga) => {
  const descriptor = store.injectedSagas[key];
  const hasSaga = Boolean(descriptor);

  if (hasSaga) {
    if (descriptor.mode !== SagaInjectionModes.DAEMON) {
      descriptor.task.cancel();
      // Clean up in production; in development we need `descriptor.saga` for hot reloading
      if (process.env.NODE_ENV === "production") {
        // Need some value to be able to detect `ONCE_TILL_UNMOUNT` sagas in `injectSaga`
        store.injectedSagas[key] = 'done'; // eslint-disable-line no-param-reassign
      }
    }
  }
};
