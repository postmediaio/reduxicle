export interface IRequestService {
  request: (method: string, url: string, body: {}) => Promise<{}>;
}
