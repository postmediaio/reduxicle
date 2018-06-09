import { IRequestService } from "./types";

export class RequestService implements IRequestService {
  public request(method: string, url: string, body: {} | null = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = () => {
        const DONE = 4;

        if (xhr.readyState === DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (err) {
              reject(`Invalid json: ${err}`);
            }
          } else {
            reject(xhr.status);
          }
        }
      };

      xhr.send(body && JSON.stringify(body));
    });
  }
}

export const defaultRequestService = (new RequestService());
