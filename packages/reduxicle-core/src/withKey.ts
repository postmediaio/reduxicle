import { ComponentClass } from "react";

export type ComponentClassWithKey = ComponentClass & { key?: string };
const withKey = (key: string) => {
  return (Component: ComponentClassWithKey): ComponentClassWithKey => {
    Component.key = key;
    return Component;
  };
};

export default withKey;
