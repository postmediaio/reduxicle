import React from "react";

import { StoreProvider } from "@reduxicle/core";
import ExampleWithReducer from "./ExampleWithReducer";

class App extends React.Component {
  public render() {
    return (
      <StoreProvider useImmutableJS>
        <ExampleWithReducer />
      </StoreProvider>
    );
  }
}

export default App;