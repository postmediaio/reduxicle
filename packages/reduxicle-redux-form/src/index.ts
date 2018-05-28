import * as React from "react";
import { IReduxiclePlugin, IReduxicleConfigWithoutPlugins } from "@reduxicle/core/internals";
import { reducer as plainReducer } from "redux-form";
import { reducer as immutableReducer } from "redux-form/immutable";

export class ReduxFormPlugin implements IReduxiclePlugin {
  public key: string = "form";
  public reducer: any;

  public initialize(config: IReduxicleConfigWithoutPlugins) {
    if (config.useImmutableJS) {
      this.reducer = immutableReducer;
    } else {
      this.reducer = plainReducer;
    }
  }
}
