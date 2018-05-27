// tslint:disable max-classes-per-file

import * as React from "react";

import { fromJS } from "immutable";
import { getDisplayName, setIn, getIn, getKeys, generateNamesFromPattern } from "../index";

describe("getKeys", () => {
  it("should get plain object keys", () => {
    const obj = {
      a: "bla",
      c: "def",
      q: {
        a: "boop",
      },
    };

    const keys = getKeys(obj);
    expect(keys).toEqual(["a", "c", "q"]);
  });

  it("should get immutable object keys", () => {
    const obj = fromJS({
      a: "bla",
      c: "def",
      q: {
        a: "boop",
      },
    });

    const keys = getKeys(obj);
    expect(keys).toEqual(["a", "c", "q"]);
  });
});

describe("getIn", () => {
  it("should get correctly using plain object", () => {
    const fixture = {
      a: {
        z: 66,
      },
      b: {
        c: 1337,
        d: {
          e: 64,
        },
        w: {
          k: 89,
        },
      },
    };

    const result = getIn(fixture, ["b", "d", "e"]);
    expect(result).toEqual(64);
  });

  it("should get correctly using immutable", () => {
    const fixture = fromJS({
      a: {
        z: 66,
      },
      b: {
        c: 1337,
        d: {
          e: 64,
        },
        w: {
          k: 89,
        },
      },
    });

    const result = getIn(fixture, ["b", "d", "e"]);
    expect(result).toEqual(64);
  });

  it("should set correctly using immutable", () => {
    const fixture = fromJS({
      a: {
        z: 66,
      },
      b: {
        c: 1337,
        d: {
          e: 64,
        },
        w: {
          k: 89,
        },
      },
    });

    const result = setIn(fixture, ["b", "d", "e"], 45);
    expect(fixture.getIn(["b", "d", "e"])).toEqual(64); // Make sure the old fixture didn't change
    expect(result.getIn(["b", "d", "e"])).toEqual(45); // Make sure the new result changed

    // Make sure unrelated parts of the state tree didn't change
    expect(result.get("a")).toBe(fixture.get("a"));
    expect(result.getIn(["b", "w"])).toBe(fixture.getIn(["b", "w"]));
    expect(result.getIn(["b", "c"])).toBe(fixture.getIn(["b", "c"]));
    expect(result.getIn(["b", "w"])).toBe(fixture.getIn(["b", "w"]));

    // Make sure related parts of the state tree did change
    expect(result.get("b")).not.toBe(fixture.get("b"));
    expect(result.getIn(["b", "d"])).not.toBe(fixture.getIn(["b", "d"]));
  });
});

describe("setIn", () => {
  it("should set correctly using plain object", () => {
    const fixture = {
      a: {
        z: 66,
      },
      b: {
        c: 1337,
        d: {
          e: 64,
        },
        w: {
          k: 89,
        },
      },
    };

    const result = setIn(fixture, ["b", "d", "e"], 45);
    expect(fixture.b.d.e).toEqual(64); // Make sure the old fixture didn't change
    expect(result.b.d.e).toEqual(45); // Make sure the new result changed
    
    // Make sure unrelated parts of the state tree didn't change
    expect(result.a).toBe(fixture.a);
    expect(result.b.w).toBe(fixture.b.w);
    expect(result.b.c).toBe(fixture.b.c);
    expect(result.b.w).toBe(fixture.b.w);

    // Make sure related parts of the state tree did change
    expect(result.b).not.toBe(fixture.b);
    expect(result.b.d).not.toBe(fixture.b.d);
  });

  it("should set correctly using immutable", () => {
    const fixture = fromJS({
      a: {
        z: 66,
      },
      b: {
        c: 1337,
        d: {
          e: 64,
        },
        w: {
          k: 89,
        },
      },
    });

    const result = setIn(fixture, ["b", "d", "e"], 45);
    expect(fixture.getIn(["b", "d", "e"])).toEqual(64); // Make sure the old fixture didn't change
    expect(result.getIn(["b", "d", "e"])).toEqual(45); // Make sure the new result changed

    // Make sure unrelated parts of the state tree didn't change
    expect(result.get("a")).toBe(fixture.get("a"));
    expect(result.getIn(["b", "w"])).toBe(fixture.getIn(["b", "w"]));
    expect(result.getIn(["b", "c"])).toBe(fixture.getIn(["b", "c"]));
    expect(result.getIn(["b", "w"])).toBe(fixture.getIn(["b", "w"]));

    // Make sure related parts of the state tree did change
    expect(result.get("b")).not.toBe(fixture.get("b"));
    expect(result.getIn(["b", "d"])).not.toBe(fixture.getIn(["b", "d"]));
  });
});

describe("getDisplayName", () => {
  function NormalFunctionComponent() { return null; }
  const ArrowFunctionComponent = () => null;
  class ClassComponent extends React.Component {}
  class ClassComponentWithDisplayName extends React.Component { public static displayName = "MyCoolDisplayName"; }
  const StringComponent = "my cool string";
  const EmptyStringComponent = "";
  const NotAComponent = 23;

  it("should get unknown for numbers", () => {
    expect(getDisplayName(NotAComponent)).toEqual("Unknown");
  });

  it("should get unknown for empty strings", () => {
    expect(getDisplayName(EmptyStringComponent)).toEqual("Unknown");
  });

  it("should get the display name for strings", () => {
    expect(getDisplayName(StringComponent)).toEqual("my cool string");
  });

  it("should get the display name for normal function components", () => {
    expect(getDisplayName(NormalFunctionComponent)).toEqual("NormalFunctionComponent");
  });

  it("should get the display name for arrow function components", () => {
    expect(getDisplayName(ArrowFunctionComponent)).toEqual("ArrowFunctionComponent");
  });

  it("should get the display name for normal class components", () => {
    expect(getDisplayName(ClassComponent)).toEqual("ClassComponent");
  });

  it("should get the display name for class components with an explicit display name", () => {
    expect(getDisplayName(ClassComponentWithDisplayName)).toEqual("MyCoolDisplayName");
  });
});
