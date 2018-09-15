import * as React from "react";
import { fromJS } from "immutable";
import { StoreProvider } from "@reduxicle/core";
import { IReduxicleConfig } from "@reduxicle/core/internals"; 
import { mount } from "enzyme";
import { replace } from "connected-react-router";
import { ReactRouterPlugin } from "../index";
import * as historyApis from "history";
import { History, Location } from "history";

import * as sinon from "sinon";

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
      router: expect.objectContaining({
        location: expect.objectContaining({
          hash: "",
          pathname: "/",
        }),
      }),
    });
  });

  // it("should update location properly", () => {
  //   const wrapper = render({
  //     plugins: [
  //       new ReactRouterPlugin(),
  //     ],
  //   });
  //   const store = wrapper.instance().getStore();
  //   const state = store.getState();
  //   store.dispatch(replace("/def"));
  //   // expect(window.location.href).toEqual("/abc");
  //   expect(store.getState().router.location.pathname).toEqual("/abc");
  // })
});
