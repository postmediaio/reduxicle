import React from "react";

import { mount } from "enzyme";
import withInjectors from "../../withInjectors";

describe("withInjectors", () => {
  it("should inject the injectors", () => {
    class UnwrappedComponent extends React.PureComponent {
      public render() {
        return null;
      }
    }

    const WrappedComponent = withInjectors()(UnwrappedComponent);
    const wrapper = mount(<WrappedComponent />);
    expect(wrapper.find(UnwrappedComponent).prop("injectReducer")).toEqual(expect.any(Function));
    expect(wrapper.find(UnwrappedComponent).prop("injectSaga")).toEqual(expect.any(Function));
    expect(wrapper.find(UnwrappedComponent).prop("ejectSaga")).toEqual(expect.any(Function));
  });
});
