import * as React from "react";
import { camelCase } from "change-case";
import { AnyAction, Dispatch, compose } from "redux";
import { InjectedReducers, IReduxicleContext, AnyReducer, AnyFunction, AnyGenerator, AnyObject } from "./types";
import { fromJS } from "immutable";
import { connect } from "react-redux";
const hoistNonReactStatics = require("hoist-non-react-statics"); // tslint:disable-line no-var-requires

import withInjectors, { IWithInjectors } from "./withInjectors";
import { getIn } from "./utils";

export interface INames {
  [key: string]: string;
}

export interface IPattern {
  [key: string]: {
    default: string,
    pattern: string,
  }
}

export interface IPatternOptions {
  name?: string;
}

export const generateNamesFromPattern = (pattern: IPattern, options: IPatternOptions) => {
  const names: INames = {};
  Object.keys(pattern).forEach((key) => {
    if (!options.name) {
      names[key] = pattern[key].default;
    }

    names[key] = camelCase(pattern[key].pattern.replace("{name}", `_${options.name}_`));
  });

  return names;
};

export interface ICreateInitialStateOptions {
  useImmutableJS?: boolean;
}

export const createInitialState = (state: any, options: ICreateInitialStateOptions) => {
  if (options.useImmutableJS) {
    return fromJS(state);
  }

  return state;
}

export interface ICreateHOC {
  createNames: () => IPattern;
  createKey: (parentKey: string, names: INames) => string;
  createInitialState: () => AnyObject|AnyGenerator|null;
  createReducer?: (inititalState: AnyObject, options: { prefix: string }) => AnyReducer;
  createSaga?: (userOptions: AnyObject, options: { prefix: string, pluginContext?: IReduxicleContext["pluginContext"] }) => AnyFunction;
  mapStateToProps: (state: AnyObject, options: { names: INames }) => AnyObject;
  mapDispatchToProps: (dispatch: Dispatch, options: { names: INames, prefix: string }) => AnyObject;
}

const createHOC = (createHOCOptions: ICreateHOC) => {
  return (userOptions: AnyObject) => {
    return (UnwrappedComponent: React.ComponentType & { key?: string }) => {
      const pattern = createHOCOptions.createNames();
      const names = generateNamesFromPattern(pattern, userOptions);
      const parentKey = userOptions.key || UnwrappedComponent.key || "";
      const key = createHOCOptions.createKey(parentKey, names);
      const prefix = key.split(".").join("/");

      class WrappedComponent extends React.PureComponent<AnyObject & IWithInjectors, { mounted: boolean }> {
        constructor(props: AnyObject & IWithInjectors) {
          super(props);
          this.state = { mounted: false };
        }

        public componentDidMount() {
          const unprocessedState = createHOCOptions.createInitialState();
          const initialState = createInitialState(unprocessedState, this.props.reduxicle.config);

          if (createHOCOptions.createReducer) {
            const reducer = createHOCOptions.createReducer(initialState, { prefix });
            this.props.reduxicle.injectReducer({
              key,
              reducer,
            });
          }

          if (createHOCOptions.createSaga) {
            const saga = createHOCOptions.createSaga(userOptions, { prefix, pluginContext: this.props.reduxicle.pluginContext });
            this.props.reduxicle.injectSaga({
              key,
              saga,
            });
          }

          this.setState({ mounted: true });
        }

        public componentWillUnmount() {
          this.props.reduxicle.ejectSaga({ key });
        }

        public render() {
          const props = { ...this.props };
          delete props.reduxicle;

          if (this.state.mounted) {
            return <UnwrappedComponent {...props} />;
          }

          return null;
        }
      }

      const mapStateToProps = (state: any) => {
        const localState = getIn(state, key.split("."));
        return createHOCOptions.mapStateToProps(localState, { names });
      };

      const mapDispatchToProps = (dispatch: Dispatch) => {
        return createHOCOptions.mapDispatchToProps(dispatch, { names, prefix });
      };

      return hoistNonReactStatics(
        compose(
          withInjectors(),
          connect(
            mapStateToProps,
            mapDispatchToProps,
          ),
        )(WrappedComponent),
      UnwrappedComponent);
    };
  };
};

export default createHOC;
