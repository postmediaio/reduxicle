import React from "react";
import { injectReducer, injectSaga, IInjectReducer, IInjectSaga, IEjectSaga, ejectSaga } from "./injectors";
import { getDisplayName } from "./utils";
import hoistNonReactStatics from 'hoist-non-react-statics';
import { AnyFunction } from "./types";

export interface IUnwrappedComponent {
  injectReducer: AnyFunction;
  injectSaga: AnyFunction;
  ejectSaga: AnyFunction;
}

const withInjectors = () => {
  return (UnwrappedComponent: React.ComponentClass<IUnwrappedComponent>) => {
    class WrappedComponent extends React.PureComponent {
      public static displayName = `withInjectors(${getDisplayName(UnwrappedComponent)})`;
      public static contextTypes = {
        store: () => null,
      };


      public injectReducer = (options: IInjectReducer & { store?: undefined }) => {
        injectReducer({
          ...options,
          store: this.context.store,
        });
      }

      public injectSaga = (options: IInjectSaga & { store?: undefined }) => {
        injectSaga({
          ...options,
          store: this.context.store,
        });
      }

      public ejectSaga = (options: IEjectSaga & { store?: undefined }) => {
        this.ejectSaga({
          ...options,
          store: this.context.store,
        });
      }

      public render() {
        return <UnwrappedComponent
          {...(this.props)}
          injectReducer={this.injectReducer}
          injectSaga={this.injectSaga}
          ejectSaga={this.ejectSaga}
        />;
      }
    }

    return hoistNonReactStatics(WrappedComponent, UnwrappedComponent);
  };
};

export default withInjectors;
