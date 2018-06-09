import { RestPlugin } from "../../plugin";
import { defaultRequestService } from "../../defaultRequestService";
import * as sinon from "sinon";

describe("RestPlugin", () => {
  let ajaxStub: sinon.SinonFakeXMLHttpRequestStatic;
  let xhrStubs: sinon.SinonFakeXMLHttpRequest[] = [];

  beforeEach(() => {
    ajaxStub = sinon.useFakeXMLHttpRequest();
    ajaxStub.onCreate = ((xhr: sinon.SinonFakeXMLHttpRequest) => {
      xhrStubs.push(xhr);
    });
  });

  afterEach(() => {
    xhrStubs = [];
    ajaxStub.restore();
  });

  it("should handle 200 response code", async () => {
    const request = defaultRequestService.request("GET", "/orders");

    expect(xhrStubs.length).toEqual(1);
    xhrStubs[0].respond(200, null, JSON.stringify({ orders: [] }));

    const response = await request;
    expect(xhrStubs[0].method).toEqual("GET");
    expect(response).toEqual({ orders: [] });
  });

  it("should handle 204 response code", async () => {
    const request = defaultRequestService.request("GET", "/orders");

    expect(xhrStubs.length).toEqual(1);
    xhrStubs[0].respond(204, null, JSON.stringify({ orders: [] }));

    const response = await request;
    expect(response).toEqual({ orders: [] });
  });

  it("should handle 200 response code with body", async () => {
    const request = defaultRequestService.request("POST", "/orders", { productId: 123 });

    expect(xhrStubs.length).toEqual(1);
    xhrStubs[0].respond(200, null, JSON.stringify({}));

    const response = await request;
    expect(response).toEqual({});
    expect(xhrStubs[0].method).toEqual("POST");
    expect(xhrStubs[0].requestBody).toEqual(JSON.stringify({ productId: 123 }));
  });

  it("should handle invalid json", async () => {
    const request = defaultRequestService.request("GET", "/orders");

    expect(xhrStubs.length).toEqual(1);
    xhrStubs[0].respond(200, null, "[");

    let requestError;
    try {
      await request;
    } catch (e) {
      requestError = e;
    }

    expect(requestError.indexOf("Invalid json")).toBeGreaterThan(-1);
  });

  it("should handle 500 response code", async () => {
    const request = defaultRequestService.request("GET", "/orders");

    expect(xhrStubs.length).toEqual(1);
    xhrStubs[0].respond(500, null, JSON.stringify({ orders: [] }));

    let requestError;
    try {
      await request;
    } catch (e) {
      requestError = e;
    }

    expect(requestError).toEqual(500);
  });
});
