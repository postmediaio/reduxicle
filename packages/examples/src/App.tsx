import * as React from "react";

import { StoreProvider } from "@reduxicle/core";
import ExampleWithDialog from "./ExampleWithDialog";
import ExampleWithReducer from "./ExampleWithReducer";
import ExampleWithForm from "./ExampleWithForm";
import { ReactRouterPlugin } from "@reduxicle/react-router";

const config = {
  plugins: [
    new ReactRouterPlugin(),
  ],
};

class App extends React.Component {
  public render() {
    return (
      <StoreProvider useImmutableJS config={config}>
        <ExampleWithDialog />
        <ExampleWithReducer />
        <ExampleWithForm />
      </StoreProvider>
    );
  }
}

export default App;
