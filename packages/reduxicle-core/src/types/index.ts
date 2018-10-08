import { AnyAction, Store as ReduxStore } from "redux";
import { Task } from "redux-saga";

export interface IPluginContext {
  [key: string]: any;
}

export type ReducerWrapper = (reducerToWrap: AnyReducer) => AnyReducer;

export interface IReduxiclePlugin {
  key: string;
  middlewares?: any[];
  reducer?: AnyReducer;
  reducerWrapper?: ReducerWrapper;
  wrapper?: any;
  context?: IPluginContext;
  initialize?: (reduxicleConfig: IReduxicleConfigWithoutPlugins) => void;
}

export interface IReduxicleConfigWithoutPlugins {
  useImmutableJS?: boolean;
}

export interface IReduxicleConfig extends IReduxicleConfigWithoutPlugins {
  plugins?: IReduxiclePlugin[];
}

export interface IReduxicleContext {
  config: IReduxicleConfig;
  runSaga: (saga: AnyFunction) => Task;
  reducerWrappers: ReducerWrapper[];
  injectedReducers: InjectedReducers;
  injectedSagas: {
    [sagaKey: string]: InjectedSagaDescriptor|"done";
  };
  pluginContext: {
    [pluginName: string]: IPluginContext;
  };
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
  reduxicle: IReduxicleContext,
};

export type AnyGenerator = Iterator<any>;

export type AnyReducer = Function; // tslint:disable-line ban-types

export enum SagaInjectionModes {
  RESTART_ON_REMOUNT = "@@saga-injector/restart-on-remount",
  DAEMON = "@@saga-injector/daemon",
  ONCE_TILL_UNMOUNT = "@@saga-injector/once-till-unmount",
}

export type ComponentTypeWithKey<P> = React.ComponentType<P> & { key: string };
