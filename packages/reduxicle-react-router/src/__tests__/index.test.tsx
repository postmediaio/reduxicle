import * as React from "react";
import { fromJS } from "immutable";
import { StoreProvider } from "@reduxicle/core";
import { IReduxicleConfig } from "@reduxicle/core/internals"; 
import { mount } from "enzyme";
import { push } from "react-router-redux";
import { ReactRouterPlugin } from "../index";

describe("ReactRouterPlugin", () => {
  const render = (config?: IReduxicleConfig) => {
    const wrapper = mount(
      <StoreProvider config={config}>
        abc
      </StoreProvider>,
    );

    return wrapper;
  };

  it("should inject the route reducer", () => {
    const wrapper = render({
      plugins: [
        new ReactRouterPlugin(),
      ],
    });
    const store = wrapper.instance().getStore();
    const state = store.getState();
    expect(state).toEqual({
      router: {
        location: {
          hash: "",
          pathname: "blank",
          search: "",
        },
      },
    });
  });

  it("should update location properly", () => {
    const wrapper = render({
      plugins: [
        new ReactRouterPlugin(),
      ],
    });
    const store = wrapper.instance().getStore();
    const state = store.getState();
    store.dispatch(push("about:blank/my-cool-age"));
    expect(window.location.href).toEqual("about:blank/my-cool-age");
    expect(store.getState().router.location.pathname).toEqual("about:blank/my-cool-age");
  })
});
