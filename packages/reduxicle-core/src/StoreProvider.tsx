import * as React from "react";
import { Provider } from "react-redux";
import { Store, AnyAction } from "redux";
import createStore from "./createStore";
import { IReduxicleConfig } from "./types"; 

export interface IStoreProvider {
  useImmutableJS?: boolean;
  config?: IReduxicleConfig;
}

export default class StoreProvider extends React.PureComponent<IStoreProvider> {
  private store: Store;
  constructor(props: IStoreProvider) {
    super(props);

    this.store = createStore(this.props.config);
  }

  public wrapWithWrappers(children: React.ReactNode) {
    let topWrapper = <div>{children}</div>; // enzyme has trouble using Fragments
    if (this.props.config && this.props.config.plugins) {
      const wrappers = this.props.config.plugins.map((plugin) => plugin.wrapper).filter(Boolean);
      wrappers.forEach((wrapper) => {
        topWrapper = React.cloneElement(wrapper, {}, topWrapper);
      });
    }

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
