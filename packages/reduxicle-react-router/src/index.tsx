import * as React from "react";
import { IReduxiclePlugin, IReduxicleConfigWithoutPlugins } from "@reduxicle/core/internals";
import createHistory from "history/createBrowserHistory";
import { ConnectedRouter, routerReducer, routerMiddleware } from "react-router-redux";
const history = createHistory();

export class ReactRouterPlugin implements IReduxiclePlugin {
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
