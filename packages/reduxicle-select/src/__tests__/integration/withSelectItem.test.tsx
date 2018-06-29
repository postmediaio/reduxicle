import * as React from "react";
import { mount } from "enzyme";
import { withSelectItem } from "../../withSelectItem";
import * as sinon from "sinon";
import { StoreProvider, withKey } from "@reduxicle/core";

describe("withSelectItem", () => {
  const render = (component: React.ReactNode) => mount(
    <StoreProvider>
      {component}
    </StoreProvider>,
  );

  it("should inject the correct props", () => {
    const UnwrappedComponent = () => null;
    const Component = withSelectItem({ name: "order" })(UnwrappedComponent);

    const wrapper = render(<Component />).find(UnwrappedComponent);

    expect(wrapper.props()).toEqual({
      selectOrder: expect.any(Function),
      selectedOrder: null,
    });
  });

  it("should select an item", () => {
    const UnwrappedComponent = () => null;
    const Component = withSelectItem({ name: "order" })(UnwrappedComponent);

    const wrapper = render(<Component />);

    wrapper.find(UnwrappedComponent).prop("selectOrder")(23);
    wrapper.update();
    expect(wrapper.find(UnwrappedComponent).prop("selectedOrder")).toEqual(23);
  });
});
