import { IReduxiclePlugin, IPluginContext } from "@reduxicle/core/internals";
import { IRequestService } from "./types";
import { defaultRequestService } from "./defaultRequestService";

export interface IRestPluginConfig {
  requestService?: IRequestService;
}

export class RestPlugin implements IReduxiclePlugin {
  public key: string = "rest";
  public context: IPluginContext = {};

  constructor(config: IRestPluginConfig = {}) {
    const requestService: IRequestService = config.requestService || defaultRequestService;
    this.context.requestService = requestService;
  }
}
