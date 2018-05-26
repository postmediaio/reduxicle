import React from "react";

import { shallow } from "enzyme";
import { Provider } from "react-redux";
import { take } from "redux-saga/effects";

import StoreProvider from "../../StoreProvider";
import { Store } from "../../types";

describe("StoreProvider", () => {
  const render = () => shallow(<StoreProvider />);

  it("should render a redux Provider", () => {
    const wrapper = render();
    expect(wrapper.find(Provider).length).toEqual(1);
    expect(wrapper.find(Provider).prop("store")).toEqual(expect.objectContaining({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      replaceReducer: expect.any(Function),
      subscribe: expect.any(Function),
    }));
  });

  it("should add the saga middleware", () => {
    const fakeActionHandler = jest.fn();
    function* fakeSaga() {
      yield take("FAKE_ACTION");
      fakeActionHandler();
    }

    const wrapper = render();
    const store = wrapper.find(Provider).prop("store") as Store;
    store.reduxicle.runSaga(fakeSaga);
    store.dispatch({ type: "FAKE_ACTION" });
    expect(fakeActionHandler).toBeCalled();
  });
});
