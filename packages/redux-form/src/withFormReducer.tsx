import React from "react";
import { withInjectors } from "@reduxicle/core/internals";
import { reducer as plainReducer } from "redux-form";
import { reducer as immutableReducer } from "redux-form/immutable";

const withFormReducer = () => {
  return (UnwrappedComponent: React.ComponentClass) => {
    class WithFormReducer extends React.PureComponent {
      constructor(props) {
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
  }
}

export default withFormReducer;
