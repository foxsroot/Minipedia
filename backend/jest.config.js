module.exports = {
  testEnvironment: "node",
  // setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  globalTeardown: "./jest.teardown.js",
};
