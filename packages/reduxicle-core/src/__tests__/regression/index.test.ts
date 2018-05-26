import * as api from "../../internals";

describe("internals", () => {
  it("should not have changed API", () => {
    expect(api).toMatchSnapshot();
  });
});
