export interface ICreateActionPrefix {
  key: string;
  dialogName: string;
}

const createActionPrefix = (key: string) => {
  const formattedKey = key.split(".").join("/");
  return `@@reduxicle/${formattedKey}`;
};

export default createActionPrefix;
