import * as React from "react";
import { call, put, takeLatest } from "redux-saga/effects";
import { Dispatch } from "redux";
import { createHOC, getIn, setIn } from "@reduxicle/core/internals";

export const withLoadItems = createHOC({
  createNames: () => ({
    items: {
      default: "items",
      pattern: "{name}",
    },
    loadItems: {
      default: "loadItems",
      pattern: "load{name}",
    },
    loadItemsError: {
      default: "loadItemsError",
      pattern: "load{name}Error",
    },
    isLoadingItems: {
      default: "isLoadingItems",
      pattern: "isLoading{name}",
    },
  }),
  createKey: (parentKey: string, names) => `${parentKey}.${names.items}`,
  createInitialState: () => ({
    data: [],
    loading: false,
    error: null,
  }),
  createReducer: (initialState: any, { prefix }: { prefix: string }) => {
    return (state = initialState, action: { type: string, data?: any, error?: any }) => {
      let newState = state;
      switch (action.type) {
        case `${prefix}/LOAD_ITEMS`:
          return setIn(state, ["loading"], true);

        case `${prefix}/LOAD_ITEMS_SUCCEEDED`:
          newState = setIn(newState, ["data"], action.data);
          newState = setIn(newState, ["loading"], false);
          return newState;

        case `${prefix}/LOAD_ITEMS_FAILED`:
          newState = setIn(newState, ["loading"], false);
          newState = setIn(newState, ["error"], action.error.toString());

          return newState;
      }

      return state;
    };
  },
  createSaga: (userOptions, { prefix, pluginContext }) => {
    return function*() {
      yield takeLatest(`${prefix}/LOAD_ITEMS`, function*() {
        if (!pluginContext || !pluginContext.rest) {
          return yield put({ type: `${prefix}/LOAD_ITEMS_FAILED`, error: "Missing plugin configuration for RestPlugin" });
        }

        try {
          const data = yield call(pluginContext.rest.requestService.request, "GET", userOptions.url);
          yield put({ type: `${prefix}/LOAD_ITEMS_SUCCEEDED`, data });
        } catch (error) {
          yield put({ type: `${prefix}/LOAD_ITEMS_FAILED`, error: error.toString() });
        }
      });
    };
  },
  mapStateToProps: (state: any, { names }) => ({
    [names.items]: getIn(state, ["data"]),
    [names.isLoadingItems]: getIn(state, ["loading"]),
    [names.loadItemsError]: getIn(state, ["error"]),
  }),
  mapDispatchToProps: (dispatch: Dispatch<any>, { names, prefix }: { names: any, prefix: string}) => ({
    [names.loadItems]: () => dispatch({ type: `${prefix}/LOAD_ITEMS` }),
  }),
});