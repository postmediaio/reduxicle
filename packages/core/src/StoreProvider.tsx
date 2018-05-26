import React from "react";
import { Provider } from "react-redux";
import { Store } from "redux";
import createStore from "./createStore";

export interface IStoreProvider {
  useImmutableJS?: boolean;
  config: {
    plugins: any[];
  };
}

export default class StoreProvider extends React.PureComponent<IStoreProvider> {
  private store: Store;
  constructor(props: IStoreProvider) {
    super(props);

    this.store = createStore({ immutable: props.useImmutableJS, ...props.config });
  }

  public wrapWithWrappers(children) {
    let topWrapper = <>{children}</>;
    const wrappers = this.props.config.plugins.map(plugin => plugin.wrapper).filter(Boolean);
    wrappers.forEach((wrapper) => {
      topWrapper = React.cloneElement(wrapper, {}, topWrapper);
    });

    return topWrapper;
  }

  /**
   * We expose this function publically so unit tests
   * can access the store
   */
  public getStore() {
    return this.store;
  }

  public render() {
    return (
      <Provider store={this.store}>
        {this.wrapWithWrappers(this.props.children)}
      </Provider>
    );
  }
}
