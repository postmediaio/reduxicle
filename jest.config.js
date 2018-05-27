module.exports = {
  "collectCoverageFrom": [
    `src/**/*.{ts,tsx,js,jsx}`,
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
  "testRegex": 'test\.(ts|js)x?$',
  "transform": {
    "(js|ts)x?$": "ts-jest"
  },
  "globals": {
    "__TS_CONFIG__": "<rootDir>/tsconfig.json"
  }
}
