import React from "react";

import { StoreProvider } from "@reduxicle/core";
import ExampleWithDialog from "./ExampleWithDialog";
import ExampleWithReducer from "./ExampleWithReducer";

class App extends React.Component {
  public render() {
    return (
      <StoreProvider useImmutableJS>
        <ExampleWithDialog />
        <ExampleWithReducer />
      </StoreProvider>
    );
  }
}

export default App;