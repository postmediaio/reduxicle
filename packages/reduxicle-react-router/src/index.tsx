import * as React from "react";
import { IReduxiclePlugin, IReduxicleConfigWithoutPlugins } from "@reduxicle/core/internals";
import { createBrowserHistory, History } from "history";

import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter,
} from "connected-react-router";

import {
  ConnectedRouter as ImmutableConnectedRouter,
  routerMiddleware as immutableRouterMiddleware,
  connectRouter  as immutableConnectRouter,
} from "connected-react-router/immutable";

export class ReactRouterPlugin implements IReduxiclePlugin {
  public key: string;
  public middlewares: any[] = [];
  public reducer: any;
  public wrapper: any;
  public reducerWrapper: any;
  private history: History;

  constructor() {
    this.key = "router";
    this.history = createBrowserHistory();
  }

  public initialize(config: IReduxicleConfigWithoutPlugins) {
    if (config.useImmutableJS) {
      this.middlewares = [immutableRouterMiddleware(this.history)];
      this.wrapper = <ImmutableConnectedRouter history={this.history} />;
      this.reducerWrapper = immutableConnectRouter(this.history);
    } else {
      this.middlewares = [routerMiddleware(this.history)];
      this.wrapper = <ConnectedRouter history={this.history} />;
      this.reducerWrapper = connectRouter(this.history);
    }
  }
}
