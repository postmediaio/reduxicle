import React from "react";

import { generateNamesFromPattern, withInjectors } from "@reduxicle/core/internals";
import hoistNonReactStatics from "hoist-non-react-statics";

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

    const key = UnwrappedComponent.key || options.key;
    class WrappedComponent extends React.PureComponent {
      public componentDidMount() {
        // this.props.injectReducer({
        //   key: `${key}.${names.dialogName}`,
        //   reducer,
        // });
      }
      public render() {
        return <UnwrappedComponent {...(this.props)}/>;
      }
    }
    
    return hoistNonReactStatics(withInjectors()(WrappedComponent), UnwrappedComponent);
  }
}

export default withDialog;
