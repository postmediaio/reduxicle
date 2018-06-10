import * as React from "react";

import { mount } from "enzyme";
import StoreProvider from "../../StoreProvider";
import withInjectors from "../../withInjectors";

describe("withInjectors", () => {
  it("should inject the injectors", () => {
    class UnwrappedComponent extends React.PureComponent {
      public render() {
        return null;
      }
    }

    const WrappedComponent = withInjectors()(UnwrappedComponent);
    const wrapper = mount(<StoreProvider><WrappedComponent /></StoreProvider>);
    expect(wrapper.find(UnwrappedComponent).prop("reduxicle")).toEqual({
      injectReducer: expect.any(Function),
      injectSaga: expect.any(Function),
      ejectSaga: expect.any(Function),
      config: {},
      pluginContext: expect.any(Object),
    });
  });
});
