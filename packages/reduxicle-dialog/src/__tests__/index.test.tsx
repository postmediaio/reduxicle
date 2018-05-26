import React from "react";
import { withDialog } from "../index";
import { mount } from "enzyme";

describe("withDialog", () => {
  it('should work', () => {
    class UnwrappedComponent extends React.Component {
      public static key = "hockeyTeams";
      public render() {
        return null;
      }
    }

    const WrappedComponent = withDialog({ name: "myDialog" })(UnwrappedComponent);
    const wrapper = mount(<WrappedComponent />);
  })
});
