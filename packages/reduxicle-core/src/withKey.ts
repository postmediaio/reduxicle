const withKey = <K extends string>(key: K) => {
  return <T extends object>(Component: T & { key?: string }): T & { key: K } => {
    Component.key = key;
    return Component as T & { key: K };
  };
};

export default withKey;
