import * as React from "react";

import { compose, withKey, withReducer } from "@reduxicle/core";
import { fromJS } from "immutable";

class ExampleWithReducer extends React.Component {
  public render() {
    return (
      <div>
        <h1>Example with reducer</h1>
      </div>
    );
  }
}

const state = fromJS({
  players: [
    { name: "Wayne Gretzky", number: "99" },
  ],
});

export default (compose(
  withReducer(() => {
    return state;
  }),
  withKey("hockeyPlayers"),
)(ExampleWithReducer) as React.ComponentClass);
