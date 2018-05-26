import { AnyAction, Store as ReduxStore } from "redux";
import { Task } from "redux-saga";

export interface IReduxiclePlugin {
  key: string;
  middlewares: any[];
  reducer: AnyReducer;
  wrapper: any;
}

export type InjectedSagaDescriptor = {
  saga: AnyFunction,
  mode: SagaInjectionModes,
  task: Task,
};

export type AnyObject = {
  [key: string]: any;
};

export type InjectedReducers = Array<{
  [key: string]: AnyReducer,
}>;

export type AnyFunction = (...params: any[]) => any;
export type Store = ReduxStore & {
  reduxicle: {
    immutable?: boolean,
    runSaga: (saga: AnyFunction) => Task,
    injectedReducers: InjectedReducers,
    injectedSagas: {
      [key: string]: InjectedSagaDescriptor|"done",
    },
  },
};

export type AnyReducer = (state: AnyObject, action: AnyAction) => AnyObject;

export enum SagaInjectionModes {
  RESTART_ON_REMOUNT = "@@saga-injector/restart-on-remount",
  DAEMON = "@@saga-injector/daemon",
  ONCE_TILL_UNMOUNT = "@@saga-injector/once-till-unmount",
}
