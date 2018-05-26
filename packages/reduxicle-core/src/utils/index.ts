import React from "react";
import { camelCase } from "change-case";
import { AnyAction, Dispatch, compose } from "redux";
import { InjectedReducers, AnyReducer, AnyObject } from "../types";
import { fromJS } from "immutable";
import { MapStateToProps } from "react-redux";
import hoistNonReactStatics from "hoist-non-react-statics";

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
    return obj.setIn(keyPath, newValue);
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

export const combineReducers = (injectedReducers: InjectedReducers) => {
  return (state: any, action: AnyAction) => {
    let newState = state;
    injectedReducers.forEach((reducersMap) => {
      Object.keys(reducersMap).forEach((reducerKey) => {
        const keyPath = reducerKey.split(".");
        const reducer = reducersMap[reducerKey];
        const oldLocalState = getIn(state, keyPath);
        const newLocalState = reducer(oldLocalState, action);
        newState = setIn(newState, keyPath, newLocalState);
      });
    });

    return newState;
  };
};
