import * as React from "react";
import { withInjectors, IWithInjectors } from "@reduxicle/core/internals";
import { reducer as plainReducer } from "redux-form";
import { reducer as immutableReducer } from "redux-form/immutable";

interface IAnyProps extends IWithInjectors {
  [key: string]: any;
}

const withFormReducer = () => {
  return (UnwrappedComponent: React.ComponentClass) => {
    class WithFormReducer extends React.PureComponent<IAnyProps, { mounted: boolean }> {
      constructor(props: IAnyProps) {
        super(props);
        this.state = { mounted: false };
      }

      public componentDidMount() {
        const reducer = this.props.reduxicle.immutable ? immutableReducer : plainReducer;
        this.props.reduxicle.injectReducer({
          key: "form",
          reducer,
        });

        this.setState({ mounted: true });
      }

      public render() {
        if (this.state.mounted) {
          return <UnwrappedComponent {...(this.props)} />;
        }

        return null;
      }
    }

    return withInjectors()(WithFormReducer);
  };
};

export default withFormReducer;
