import React from "react";
import { Provider } from "react-redux";
import { Store } from "redux";
import createStore from "./createStore";

export interface IStoreProvider {
  useImmutableJS?: boolean;
}

export default class StoreProvider extends React.PureComponent<IStoreProvider> {
  private store: Store;
  constructor(props: IStoreProvider) {
    super(props);

    this.store = createStore({ immutable: props.useImmutableJS });
  }

  public render() {
    return (
      <Provider store={this.store}>
        <>
          {this.props.children}
        </>
      </Provider>
    );
  }
}
