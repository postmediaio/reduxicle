import { RestPlugin } from "../../plugin";
import { defaultRequestService } from "../../defaultRequestService";

describe("RestPlugin", () => {
  it("should add the key and the default request service", () => {
    const result = new RestPlugin();
    expect(result.key).toEqual("rest");
    expect(result.context.requestService).toBe(defaultRequestService);
  });

  it("should add the key and a custom request service", () => {
    const customRequestService = {
      request: () => Promise.resolve({}),
    };

    const result = new RestPlugin({ requestService: customRequestService });
    expect(result.key).toEqual("rest");
    expect(result.context.requestService).toBe(customRequestService);
  });
});
