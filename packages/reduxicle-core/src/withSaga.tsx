import * as React from "react";
import { getDisplayName } from "./utils";
import { AnyFunction, SagaInjectionModes, AnyObject } from "./types";
import { injectSaga, ejectSaga } from "./injectors"; 
const hoistNonReactStatics = require("hoist-non-react-statics"); // tslint:disable-line no-var-requires

export type WithSagaOptions = { key: string, saga: AnyFunction, mode?: SagaInjectionModes } | AnyFunction;

const withSaga = (options: WithSagaOptions) => {
  return (UnwrappedComponent: React.ComponentClass & { key?: string }): React.ComponentClass => {
    const resolvedOptions = {
      key: typeof options === "function" ? UnwrappedComponent.key : (options.key || UnwrappedComponent.key),
      saga: typeof options === "function" ? options : options.saga,
      mode: typeof options === "function" ?
        SagaInjectionModes.RESTART_ON_REMOUNT :
        (options.mode || SagaInjectionModes.RESTART_ON_REMOUNT),
    };

    class WrappedComponent extends React.PureComponent<AnyObject, { mounted: boolean }> {
      public static displayName = `withSaga(${getDisplayName(UnwrappedComponent)})`;
      public static key = resolvedOptions.key;
      public static contextTypes = {
        store: () => null,
      };

      constructor(props: AnyObject) {
        super(props);
        this.state = { mounted: false };
      }

      public componentDidMount() {
        if (resolvedOptions.key) {
          injectSaga({
            key: resolvedOptions.key,
            mode: resolvedOptions.mode,
            saga: resolvedOptions.saga,
          }, this.context.store);
        }

        // TODO: Warn if not using key

        this.setState({ mounted: true });
      }

      public componentWillUnmount() {
        if (resolvedOptions.key) {
          ejectSaga({
            key: resolvedOptions.key,
          }, this.context.store);
        }
      }

      public render() {
        if (this.state.mounted) {
          return <UnwrappedComponent {...(this.props)} />;
        }

        return null;
      }
    }

    return hoistNonReactStatics(WrappedComponent, UnwrappedComponent);
  };
};

export default withSaga;
