// tslint:disable max-classes-per-file
import React from 'react';
import { take } from "redux-saga/effects";
import withSaga from "../../withSaga";
import StoreProvider from "../../StoreProvider";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Store, SagaInjectionModes } from '../../types';

describe("withSaga", () => {
  const setup = ({ mode }: { mode?: SagaInjectionModes } = {}) => {
    class UnwrapepdComponent extends React.PureComponent {
      public render() {
        return <div>my content</div>;
      }
    }

    const actionHandler = jest.fn();
    function* fakeSaga() {
      while (true) {
        yield take("FAKE_ACTION");
        actionHandler();
      }
    }

    const WrappedComponent = withSaga({ key: "mySagaKey", saga: fakeSaga, mode })(UnwrapepdComponent);

    class TestHarness extends React.PureComponent<{ show?: boolean }> {
      public render() {
        return (
          <StoreProvider>
            {this.props.show && <WrappedComponent />}
          </StoreProvider>
        );
      }
    }

    const wrapper = mount(<TestHarness show />);
    const store = wrapper.find(Provider).prop("store") as Store;
    expect(WrappedComponent.key).toEqual("mySagaKey");

    return {
      store,
      wrapper,

      actionHandler,
      remount: () => wrapper.setProps({ show: true }),
      unmount: () => wrapper.setProps({ show: false }),
    };
  };
  
  it("should inject the saga in RESTART_ON_REMOUNT mode", () => {
    const { wrapper, store, actionHandler, unmount, remount } = setup();
    store.dispatch({ type: "FAKE_ACTION" });
    store.dispatch({ type: "FAKE_ACTION" });
    unmount();

    store.dispatch({ type: "FAKE_ACTION" });
    expect(actionHandler).toHaveBeenCalledTimes(2);

    remount();
    store.dispatch({ type: "FAKE_ACTION" });
    expect(actionHandler).toHaveBeenCalledTimes(3);
  });

  it("should inject the saga in ONCE_TILL_UNMOUNT mode", () => {
    const { wrapper, store, actionHandler, unmount, remount } = setup({ mode: SagaInjectionModes.ONCE_TILL_UNMOUNT });
    store.dispatch({ type: "FAKE_ACTION" });
    store.dispatch({ type: "FAKE_ACTION" });
    unmount();

    store.dispatch({ type: "FAKE_ACTION" });
    expect(actionHandler).toHaveBeenCalledTimes(2);

    remount();
    store.dispatch({ type: "FAKE_ACTION" });
    expect(actionHandler).toHaveBeenCalledTimes(2);
  });

  it("should inject the saga in DAEMON mode (never cancelled)", () => {
    const { wrapper, store, actionHandler, unmount } = setup({ mode: SagaInjectionModes.DAEMON });
    store.dispatch({ type: "FAKE_ACTION" });
    store.dispatch({ type: "FAKE_ACTION" });
    unmount();
    store.dispatch({ type: "FAKE_ACTION" });

    expect(actionHandler).toHaveBeenCalledTimes(3);
  });
});
