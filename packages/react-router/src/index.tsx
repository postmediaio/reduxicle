import React from "react";
import { IPlugin } from "@reduxicle/core";
import createHistory from "history/createBrowserHistory";
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

const history = createHistory();
export class ReactRouterPlugin implements IPlugin {
  public key: string;
  public middlewares: any[];
  public reducer: any;
  public wrapper: any;

  constructor() {
    const middleware = routerMiddleware(history);
    this.key = "router";
    this.middlewares = [middleware];
    this.reducer = routerReducer;
    this.wrapper = <ConnectedRouter history={history} />;
  }
}

// import ReactRouterPlugin from '@reduxicle/react-router';
// import ReduxFormPlugin from '@reduxicle/redux-form';
// import ImmutableJSPlugin from '@reduxicle/immutable-js';

// const StoreProvider = createStoreProvider([
//   new ReactRouterPlugin(),
//   new ReduxFormPlugin(),
//   new ImmutableJSPlugin(),
// ]);

// const config = {
//   plugins: [
//     new ReactRouterPlugin(),
//     new ReduxFormPlugin(),
//     new ImmutableJSPlugin(),
//   ],
//   apiService
// }

// <StoreProvider config={config}/>
