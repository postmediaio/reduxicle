import * as React from "react";
import { Dispatch } from "redux";
import { createHOC } from "@reduxicle/core/internals";

export const withSelectItem = createHOC({
  createNames: () => ({
    selectItem: {
      default: "selectItem",
      pattern: "select{name}",
    },
    selectedItem: {
      default: "selectedItem",
      pattern: "selected{name}",
    },
  }),
  createKey: (parentKey: string, names) => `${parentKey}.${names.selectedItem}`,
  createInitialState: () => null,
  createReducer: (initialState: any, { prefix }: { prefix: string }) => {
    return (state = initialState, action: { type: string, item?: any }) => {
      switch (action.type) {
        case `${prefix}/SELECT_ITEM`:
          return action.item;
      }

      return state;
    };
  },
  mapStateToProps: (state: any, { names }) => ({
    [names.selectedItem]: state,
  }),
  mapDispatchToProps: (dispatch: Dispatch<any>, { names, prefix }: { names: any, prefix: string}) => ({
    [names.selectItem]: (item: any) => dispatch({ type: `${prefix}/SELECT_ITEM`, item }),
  }),
});
