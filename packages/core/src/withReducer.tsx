import React from "react";
import { getDisplayName } from "./utils";
import { AnyReducer } from "./types";
import { injectReducer } from "./injectors"; 
import hoistNonReactStatics from 'hoist-non-react-statics';

export type WithReducerOptions = { key: string, reducer: AnyReducer } | AnyReducer;

const withReducer = (options: WithReducerOptions) => {
  return (UnwrappedComponent: React.ComponentClass & { key: string }) => {
    const resolvedOptions = {
      key: typeof options === "function" ? UnwrappedComponent.key : (options.key || UnwrappedComponent.key),
      reducer: typeof options === "function" ? options : options.reducer,
    };

    class WrappedComponent extends React.PureComponent {
      public static key = resolvedOptions.key;
      public static contextTypes = {
        store: () => null,
      };

      public static displayName = `withReducer(${getDisplayName(UnwrappedComponent)})`;
      public componentDidMount() {
        injectReducer({
          key: resolvedOptions.key,
          reducer: resolvedOptions.reducer,
          store: this.context.store,
        });
      }

      public render() {
        return <UnwrappedComponent {...(this.props)} />;
      }
    }

    return hoistNonReactStatics(WrappedComponent, UnwrappedComponent);
  };
};

export default withReducer;
