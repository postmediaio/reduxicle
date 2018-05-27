import * as React from "react";
import { Dispatch } from "redux";
import {
  getIn,
  setIn,
  connect,
  compose,
  createHOC,
  withInjectors,
} from "@reduxicle/core/internals";

const withDialog = createHOC({
  createNames: () => ({
    dialogName: {
      default: "dialog",
      pattern: "{name}Dialog",
    },
    isDialogOpen: {
      default: "isDialogOpen",
      pattern: "is{name}DialogOpen",
    },
    openDialog: {
      default: "openDialog",
      pattern: "open{name}Dialog",
    },
    closeDialog: {
      default: "closeDialog",
      pattern: "close{name}Dialog",
    },
  }),
  createKey: (parentKey: string, names: any) => `${parentKey}.${names.dialogName}`,
  createInitialState: () => ({
    open: false,
  }),
  createReducer: (initialState: any, { prefix }: { prefix: string }) => {
    return (state = initialState, action: { type: string }) => {
      switch (action.type) {
        case `${prefix}/OPEN`:
          return setIn(state, ["open"], true);
        case `${prefix}/CLOSE`:
          return setIn(state, ["open"], false);
      }

      return state;
    };
  },
  mapStateToProps: (state: any, { names }: { names: any}) => ({
    [names.isDialogOpen]: getIn(state, ["open"]),
  }),
  mapDispatchToProps: (dispatch: Dispatch<any>, { names, prefix }: { names: any, prefix: string}) => ({
    [names.openDialog]: () => dispatch({ type: `${prefix}/OPEN` }),
    [names.closeDialog]: () => dispatch({ type: `${prefix}/CLOSE` }),
  }),
});

export default withDialog;
