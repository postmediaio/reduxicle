import * as React from "react";
import { camelCase } from "change-case";
import { AnyAction, Dispatch, compose } from "redux";
import { InjectedReducers, AnyReducer, AnyObject } from "./types";
import { fromJS } from "immutable";
import { connect } from "react-redux";
const hoistNonReactStatics = require("hoist-non-react-statics"); // tslint:disable-line no-var-requires

import withInjectors from "./withInjectors";
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
}

export interface ICreateInitialStateOptions {
  immutable?: boolean;
}

export const createInitialState = (state: any, options: ICreateInitialStateOptions) => {
  if (options.immutable) {
    return fromJS(state);
  }

  return state;
}

export interface ICreateHOC {
  createNames: () => IPattern;
  createKey: (parentKey: string, names: INames) => string;
  createInitialState: () => AnyObject;
  createReducer: (inititalState: AnyObject, options: { prefix: string }) => AnyReducer;
  mapStateToProps: (state: AnyObject, options: { names: INames }) => AnyObject;
  mapDispatchToProps: (dispatch: Dispatch, options: { names: INames, prefix: string }) => AnyObject;
}

const createHOC = (createHOCOptions: ICreateHOC) => {
  return (options: AnyObject) => {
    return (UnwrappedComponent: React.ComponentClass & { key?: string }) => {
      const pattern = createHOCOptions.createNames();
      const names = generateNamesFromPattern(pattern, options);
      const parentKey = options.key || UnwrappedComponent.key || "";
      const key = createHOCOptions.createKey(parentKey, names);
      const prefix = key.split(".").join("/");

      class WrappedComponent extends React.PureComponent<AnyObject, { mounted: boolean }> {
        constructor(props: AnyObject) {
          super(props);
          this.state = { mounted: false };
        }

        public componentDidMount() {
          const unprocessedState = createHOCOptions.createInitialState();
          const initialState = createInitialState(unprocessedState, this.props.reduxicle);
          const reducer = createHOCOptions.createReducer(initialState, { prefix });

          this.props.reduxicle.injectReducer({
            key,
            reducer,
          });

          this.setState({ mounted: true });
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
