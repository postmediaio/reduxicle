import { takeEvery } from "redux-saga/effects";
import createStore from "../../createStore";
describe("createStore", () => {
  it("should use superReducer", () => {
    const store = createStore({
      superReducer: (state = { numScoops: 0 }, action) => {
        if (action.type === "INCREASE_SCOOPS") {
          return Object.assign({}, state, { numScoops: 1 });
        }

        return state;
      },
    });

    store.dispatch({ type: "INCREASE_SCOOPS" });
    expect(store.getState()).toEqual({ numScoops: 1 });
  });

  it("should use superSaga", () => {
    const mockFn = jest.fn();
    const store = createStore({
      superSaga: function* () {
        yield takeEvery("DO_A_THING", function* () {
          mockFn();
          return null;
        });

        return null;
      },
    });

    store.dispatch({ type: "DO_A_THING" });
    expect(mockFn).toBeCalled();
  });
});
