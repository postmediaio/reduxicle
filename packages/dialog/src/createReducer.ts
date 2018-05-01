import { setIn, createInitialState } from '@reduxicle/core/internals';
import { AnyAction } from "redux";
import createActionPrefix, { ICreateActionPrefix } from "./createActionPrefix";

const createReducer = (prefix: string, reduxicleOptions: any) => {
  const initialState = createInitialState({
    open: false,
  }, reduxicleOptions);

  return (state = initialState, action: AnyAction) => {
    switch (action.type) {
      case `${prefix}/OPEN`:
        return setIn(state, ["open"], true);
      case `${prefix}/CLOSE`:
        return setIn(state, ["open"], false);
    }
    
    return state;
  }
}

export default createReducer;
