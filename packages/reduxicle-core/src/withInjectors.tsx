import * as React from "react";
import { injectReducer, injectSaga, IInjectReducer, IInjectSaga, IEjectSaga, ejectSaga } from "./injectors";
import { getDisplayName } from "./utils";
import { AnyFunction, IReduxicleConfig } from "./types";
const hoistNonReactStatics = require("hoist-non-react-statics"); // tslint:disable-line no-var-requires

export interface IWithInjectors {
  reduxicle: {
    config: IReduxicleConfig;
    injectReducer: (options: IInjectReducer) => void;
    injectSaga: (options: IInjectSaga) => void;
    ejectSaga: (options: IEjectSaga) => void;
  };
}

function withInjectors<T extends object>() {
  return (UnwrappedComponent: React.ComponentType<T & IWithInjectors>) => {
    class WrappedComponent extends React.PureComponent {
      public static displayName = `withInjectors(${getDisplayName(UnwrappedComponent)})`;
      public static contextTypes = {
        store: () => null,
      };


      public injectReducer = (options: IInjectReducer) => {
        injectReducer(options, this.context.store);
      }

      public injectSaga = (options: IInjectSaga) => {
        injectSaga(options, this.context.store);
      }

      public ejectSaga = (options: IEjectSaga) => {
        ejectSaga(options, this.context.store);
      }

      public render() {
        return <UnwrappedComponent
          {...(this.props)}
          reduxicle={{
            injectReducer: this.injectReducer,
            injectSaga: this.injectSaga,
            ejectSaga: this.ejectSaga,
            config: this.context.store.reduxicle.config,
          }}
        />;
      }
    }

    return hoistNonReactStatics(WrappedComponent, UnwrappedComponent);
  };
};

export default withInjectors;
