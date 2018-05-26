import React from "react";
import { getDisplayName } from "./utils";
import { AnyFunction, SagaInjectionModes, AnyObject } from "./types";
import { injectSaga, ejectSaga } from "./injectors"; 
import hoistNonReactStatics from "hoist-non-react-statics";

export type WithSagaOptions = { key: string, saga: AnyFunction, mode: SagaInjectionModes } | AnyFunction;

const withSaga = (options: WithSagaOptions) => {
  return (UnwrappedComponent: React.ComponentClass & { key: string }) => {
    const resolvedOptions = {
      key: typeof options === "function" ? UnwrappedComponent.key : (options.key || UnwrappedComponent.key),
      saga: typeof options === "function" ? options : options.saga,
      mode: typeof options === "function" ?
        SagaInjectionModes.ONCE_TILL_UNMOUNT :
        (options.mode || SagaInjectionModes.ONCE_TILL_UNMOUNT),
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
        injectSaga({
          key: resolvedOptions.key,
          mode: resolvedOptions.mode,
          saga: resolvedOptions.saga,
        }, this.context.store);

        this.setState({ mounted: true });
      }

      public componentWillUnmount() {
        ejectSaga({
          key: resolvedOptions.key,
        }, this.context.store);
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
