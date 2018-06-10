import * as React from "react";
import { mount } from "enzyme";
import { withLoadItems } from "../../hocs";
import { RestPlugin } from "../../plugin";
import * as sinon from "sinon";
import { StoreProvider } from "@reduxicle/core";

const finishAllPromises = () => new Promise((resolve) => setImmediate(resolve));

describe("withLoadItems", () => {
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

  const render = (component: React.ReactNode) => mount(
    <StoreProvider config={{
      plugins: [
        new RestPlugin(),
      ],
    }}>
      {component}
    </StoreProvider>,
  );

  it("should inject the correct props", () => {
    const UnwrappedComponent = () => null;
    const Component = withLoadItems({ name: "orders" })(UnwrappedComponent);

    const wrapper = render(<Component />).find(UnwrappedComponent);

    expect(wrapper.props()).toEqual({
      orders: [],
      loadOrders: expect.any(Function),
      isLoadingOrders: false,
      loadOrdersError: null,
    });
  });

  it("should fetch the orders", async () => {
    const mockOrders = [{ orderNum: 123 }];
    const UnwrappedComponent = () => null;
    const Component = withLoadItems({ name: "orders", url: "/orders" })(UnwrappedComponent);
    const wrapper = render(<Component />);
    wrapper.find(UnwrappedComponent).prop("loadOrders")();
    wrapper.update();
    expect(wrapper.find(UnwrappedComponent).props().isLoadingOrders).toEqual(true);

    xhrStubs[0].respond(200, null, JSON.stringify(mockOrders));
    await finishAllPromises();
    wrapper.update();

    expect(wrapper.find(UnwrappedComponent).props().isLoadingOrders).toEqual(false);
    expect(wrapper.find(UnwrappedComponent).props().orders).toEqual(mockOrders);
  });

  it("should fail to fetch the orders because we're missing the RestPlugin", async () => {
    const UnwrappedComponent = () => null;
    const Component = withLoadItems({ name: "orders", url: "/orders" })(UnwrappedComponent);
    const wrapper = render(
      <StoreProvider>
        <Component />
      </StoreProvider>,
    );
    wrapper.find(UnwrappedComponent).prop("loadOrders")();
    wrapper.update();


    expect(wrapper.find(UnwrappedComponent).props().loadOrdersError).toEqual(
      "Missing plugin configuration for RestPlugin",
    );
  });

  it("should fail to fetch the orders because of a 500 error", async () => {
    const UnwrappedComponent = () => null;
    const Component = withLoadItems({ name: "orders", url: "/orders" })(UnwrappedComponent);
    const wrapper = render(<Component />);
    wrapper.find(UnwrappedComponent).prop("loadOrders")();
    wrapper.update();
    expect(wrapper.find(UnwrappedComponent).props().isLoadingOrders).toEqual(true);

    xhrStubs[0].respond(500, null, "");
    await finishAllPromises();
    wrapper.update();

    expect(wrapper.find(UnwrappedComponent).props().isLoadingOrders).toEqual(false);
    expect(wrapper.find(UnwrappedComponent).props().orders).toEqual([]);
    expect(wrapper.find(UnwrappedComponent).props().loadOrdersError).toEqual("500");
  });
});
