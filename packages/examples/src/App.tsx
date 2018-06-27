import * as React from "react";

import { StoreProvider } from "@reduxicle/core";
import ExampleWithDialog from "./ExampleWithDialog";
import ExampleWithReducer from "./ExampleWithReducer";
import { ReactRouterPlugin } from "@reduxicle/react-router";

const config = {
  useImmutableJS: true,
  plugins: [
    new ReactRouterPlugin(),
  ],
};

class App extends React.Component {
  public render() {
    return (
      <StoreProvider config={config}>
        <ExampleWithDialog />
        <ExampleWithReducer />
      </StoreProvider>
    );
  }
}

export default App;
