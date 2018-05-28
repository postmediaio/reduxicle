import * as React from "react";
import { fromJS } from "immutable";
import { StoreProvider } from "@reduxicle/core";
import { IReduxicleConfig } from "@reduxicle/core/internals"; 
import { mount } from "enzyme";

import { ReduxFormPlugin } from "../../index";

describe("ReduxFormPlugin", () => {
  const render = (config?: IReduxicleConfig) => {
    const wrapper = mount(
      <StoreProvider config={config}>
        abc
      </StoreProvider>
    );

    return wrapper;
  }

  it("should inject the form reducer", () => {
    const wrapper = render({
      plugins: [
        new ReduxFormPlugin(),
      ],
    });
    const store = wrapper.instance().getStore();
    const state = store.getState();
    expect(state).toEqual({
      form: {},
    });
  });

  it("should inject the form reducer with immutable", () => {
    const wrapper = render({ 
      useImmutableJS: true,
      plugins: [
        new ReduxFormPlugin(),
      ],
    });
    const store = wrapper.instance().getStore();
    const state = store.getState();
    expect(state).toEqual(fromJS({
      form: {},
    }));
  });
});
