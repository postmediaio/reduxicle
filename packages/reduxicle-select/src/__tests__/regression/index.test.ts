import * as api from "../../index";

describe("index", () => {
  it("should not have changed API", () => {
    expect(api).toMatchSnapshot();
  });
});
