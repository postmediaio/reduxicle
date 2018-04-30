import { camelCase } from "change-case";
import { AnyAction } from "redux";
import { AnyReducer, AnyObject } from "../types";

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

export const combineReducers = (reducersMap: { [key: string]: AnyReducer }) => {
  return (state: any, action: AnyAction) => {
    let newState = state;
    Object.keys(reducersMap).forEach((reducerKey) => {
      const keyPath = reducerKey.split(".");
      const reducer = reducersMap[reducerKey];
      const oldLocalState = getIn(newState, keyPath);
      const newLocalState = reducer(oldLocalState, action);
      newState = setIn(newState, keyPath, newLocalState);
    });

    // return newState;
    return newState;
  }
}

export interface INames {
  [key: string]: string;
}

export interface IPattern {
  [key: string]: {
    default: string,
    pattern: string,
  }
}

export interface IPatternOptions {
  name?: string;
}

export const generateNamesFromPattern = (pattern: IPattern, options: IPatternOptions) => {
  const names: INames = {};
  Object.keys(pattern).forEach((key) => {
    if (!options.name) {
      names[key] = pattern[key].default;
    }

    names[key] = camelCase(pattern[key].pattern.replace("{name}", `_${options.name}_`));
  });
  
  return names;
}
