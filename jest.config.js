function getTestRegex() {
  if (process.env.TEST_PACKAGE) {
    return `${process.env.TEST_PACKAGE}.*test\.(ts|js)x?$`;
  }

  return 'test\\.(ts|js)x?$';
}

function getCoverageGlob() {
  if (process.env.TEST_PACKAGE) {
    return `**/${process.env.TEST_PACKAGE}/src/**/*.{ts,tsx,js,jsx}`;
  }

  return '**/src/**/*.{ts,tsx,js,jsx}';
}

module.exports = {
  "collectCoverageFrom": [
    getCoverageGlob(),
    "!src/**/*.test.{ts,tsx,js,jsx}",
    "!src/*/RbGenerated*/*.{ts,tsx,js,jsx}",
    "!src/**/_stories.{ts,tsx}"
  ],
  "moduleDirectories": [
    "node_modules"
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx"
  ],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/lib/"
  ],
  "setupTestFrameworkScriptFile": "<rootDir>/internals/setupTestFrameworkScriptFile.js",
  "testRegex": getTestRegex(),
  "transform": {
    "(js|ts)x?$": "ts-jest"
  },
  "globals": {
    "__TS_CONFIG__": "<rootDir>/tsconfig.json"
  },
  "testURL": 'http://localhost'
}
