import * as React from "react";
import { camelCase } from "change-case";
import { AnyAction, Dispatch, compose } from "redux";
import { InjectedReducers, AnyReducer, AnyObject, ReducerWrapper } from "../types";
import { fromJS } from "immutable";
import { MapStateToProps } from "react-redux";
const hoistNonReactStatics = require("hoist-non-react-statics"); // tslint:disable-line no-var-requires

/**
 * @name getDisplayName
 * @description Get's the display name of a component
 * Based off: https://github.com/jurassix/react-display-name/blob/master/src/getDisplayName.js
 * It's copied here so we can have zero dependencies
 */
export const getDisplayName = (Component: any) => (
  Component.displayName ||
  Component.name ||
  (typeof Component === "string" && Component.length > 0
    ? Component
    : "Unknown")
);

export function getKeys(obj: AnyObject) {
  const isImmutable = Boolean(obj.toJS);
  if (isImmutable) {
    return obj.keySeq().toArray();
  }

  return Object.keys(obj);
}

export function getIn(obj: AnyObject, keyPath: string[]) {
  if (!obj) {
    return undefined;
  }

  const isImmutable = Boolean(obj.toJS);
  if (isImmutable) {
    return obj.getIn(keyPath);
  }

  let newObj = obj;
  let index = 0;
  while (newObj !== null && typeof newObj !== "undefined" && index < keyPath.length) {
    newObj = newObj[keyPath[index++]];
  }
  return (index && index === keyPath.length) ? newObj : undefined;
}

export function setIn(obj: AnyObject, keyPath: string[], newValue: any) {
  const isImmutable = Boolean(obj.toJS);
  if (isImmutable) {
    return obj.setIn(keyPath, fromJS(newValue));
  }

  const newObj = { ...obj };
  let cursor = newObj;
  for (let i = 0; i < keyPath.length - 1; i++) {
    const key = keyPath[i];
    cursor[key] = Object.assign({}, cursor[key]);
    cursor = cursor[key];
  }

  const lastKey = keyPath[keyPath.length - 1];
  cursor[lastKey] = newValue;
  return newObj;
}

export const reduceReducerMap = (reducersMap: any, newState: any, state: any, action: any) => {
  Object.keys(reducersMap).forEach((reducerKey) => {
    const keyPath = reducerKey.split(".");
    const reducer = reducersMap[reducerKey];
    const oldLocalState = getIn(state, keyPath);
    const newLocalState = reducer(oldLocalState, action);
    newState = setIn(newState, keyPath, newLocalState);
  });

  return newState;
};

export const combineReducers = (reducersMap: any) => {
  return (state: any, action: any) => {
    return reduceReducerMap(reducersMap, state, state, action);
  };
};

export const combineReducersAndWrappers = (injectedReducers: InjectedReducers, reducerWrappers: ReducerWrapper[] = []) => {
  const unwrappedReducer = (state: any, action: AnyAction) => {
    let newState = state;
    injectedReducers.forEach((reducersMap) => {
      newState = reduceReducerMap(reducersMap, newState, state, action);
    });

    return newState;
  };

  const rootReducer = compose<any>(...reducerWrappers)(unwrappedReducer);
  return rootReducer;
};
