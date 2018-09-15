import React from "react";
import { ComponentTypeWithKey } from "./types";

const withKey = (key: string) => {
  return <P extends object>(Component: React.ComponentType<P>): ComponentTypeWithKey<P> => {
    const ComponentWithKey: ComponentTypeWithKey<P> = Component as any;
    ComponentWithKey.key = key;
    return ComponentWithKey;
  };
};

export default withKey;
