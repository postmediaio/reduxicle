import React from "react";

import { StoreProvider } from "@reduxicle/core";
import ExampleWithDialog from "./ExampleWithDialog";
import ExampleWithReducer from "./ExampleWithReducer";
import ExampleWithForm from "./ExampleWithForm";

class App extends React.Component {
  public render() {
    return (
      <StoreProvider useImmutableJS>
        <ExampleWithDialog />
        <ExampleWithReducer />
        <ExampleWithForm />
      </StoreProvider>
    );
  }
}

export default App;
