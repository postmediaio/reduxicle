import * as React from "react";
import { getDisplayName } from "./utils";
import { AnyReducer, ComponentTypeWithKey } from "./types";
import { injectReducer } from "./injectors";
const hoistNonReactStatics = require("hoist-non-react-statics"); // tslint:disable-line no-var-requires

export type WithReducerOptions = { key: string, reducer: AnyReducer } | AnyReducer;

const withReducer = (options: WithReducerOptions) => {
  return <P extends object>(UnwrappedComponent: ComponentTypeWithKey<P>): ComponentTypeWithKey<P> => {
    const resolvedOptions = {
      key: typeof options === "function" ? UnwrappedComponent.key : (options.key || UnwrappedComponent.key),
      reducer: typeof options === "function" ? options : options.reducer,
    };

    class WrappedComponent extends React.PureComponent<P, { mounted: boolean }> {
      public static displayName = `withReducer(${getDisplayName(UnwrappedComponent)})`;
      public static key = resolvedOptions.key;
      public static contextTypes = {
        store: () => null,
      };

      constructor(props: P, context: any) {
        super(props);

        injectReducer({
          key: resolvedOptions.key,
          reducer: resolvedOptions.reducer,
        }, context.store);
      }

      public render() {
        return <UnwrappedComponent {...(this.props)} />;
      }
    }

    return hoistNonReactStatics(WrappedComponent, UnwrappedComponent);
  };
};

export default withReducer;
