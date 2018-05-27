import * as React from "react";

import { compose, withKey, withReducer } from "@reduxicle/core";
import { withDialog } from "@reduxicle/dialog";

export interface IExampleWithDialog {
  openAddDialog: () => {};
  closeAddDialog: () => {};
  isAddDialogOpen: boolean;
}

class ExampleWithDialog extends React.Component<IExampleWithDialog> {
  public render() {
    return (
      <div>
        <h1>Example with dialog</h1>
        <h2>Dialog is: {this.props.isAddDialogOpen ? "Yes" : "No"}</h2>
        <button onClick={this.props.openAddDialog}>Open Dialog</button>
        <button onClick={this.props.closeAddDialog}>Close Dialog</button>
      </div>
    );
  }
}

export default compose(
  withDialog({ name: "add" }),
  withKey("hockeyPlayers"),
)(ExampleWithDialog);
