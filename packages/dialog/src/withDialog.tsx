import React from "react";
import { Dispatch } from "redux";
import { fromJS } from "immutable";
import { getIn, connect, compose, generateNamesFromPattern, withInjectors } from "@reduxicle/core/internals";
import hoistNonReactStatics from "hoist-non-react-statics";
import createActionPrefix from "./createActionPrefix";
import createReducer from "./createReducer";

const withDialog = (options: { name: string, key?: string }) => {
  return (UnwrappedComponent: React.ComponentClass & { key: string }) => {
    const names = generateNamesFromPattern({
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
    }, {
      name: options.name,
    });

    const parentKey = options.key || UnwrappedComponent.key || "";
    const key = `${parentKey}.${names.dialogName}`;
    const prefix = createActionPrefix(key);

    class WrappedComponent extends React.PureComponent<any> {
      public componentDidMount() {
        this.props.reduxicle.injectReducer({
          key,
          reducer: createReducer(prefix, this.props.reduxicle),
        });
      }
      public render() {
        const props = { ...this.props };
        delete props.reduxicle;

        return <UnwrappedComponent {...props} />;
      }
    }

    return hoistNonReactStatics(
      compose(
        withInjectors(),
        connect(
          (state: any) => ({
            [names.isDialogOpen]: getIn(state, [ ...key.split("."), "open"]),
          }),
          (dispatch: Dispatch) => ({
            [names.openDialog]: () => dispatch({ type: `${prefix}/OPEN` }),
            [names.closeDialog]: () => dispatch({ type: `${prefix}/CLOSE` }),
          }),
        ),
      )(WrappedComponent),
    UnwrappedComponent);

  };
};

export default withDialog;
