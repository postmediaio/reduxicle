import React from "react";
import { getDisplayName } from "./utils";
import { AnyFunction, SagaInjectionModes } from "./types";
import { injectSaga, ejectSaga } from "./injectors"; 
import hoistNonReactStatics from 'hoist-non-react-statics';

const withSaga = ({ key, saga, mode }: { key: string, saga: AnyFunction, mode: SagaInjectionModes }) => {
  return (UnwrappedComponent: React.ComponentClass) => {
    class WrappedComponent extends React.PureComponent {
      public static key = key;
      public static contextTypes = {
        store: () => null,
      };

      public static displayName = `withSaga(${getDisplayName(UnwrappedComponent)})`;
      public componentDidMount() {
        injectSaga({
          key,
          mode,
          saga,
          store: this.context.store,
        });
      }

      public componentWillUnmount() {
        ejectSaga({
          key,
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

export default withSaga;
