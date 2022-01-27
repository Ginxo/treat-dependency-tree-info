const { main } = require("../../src/bin/main");
jest.mock("../../src/bin/main");
const { getInput } = require("@actions/core");
jest.mock("@actions/core");
const { start } = require("../../src/bin/github-action");

afterEach(() => {
  jest.clearAllMocks();
});

describe("start", () => {
  test("no inputs", () => {
    // Act
    start();

    // Assert
    expect(main).toBeCalledTimes(1);
    expect(main).toHaveBeenCalledWith({
      artifacts: undefined,
      debug: false,
      exclude: undefined,
      filter: undefined,
      logFilePath: undefined,
      outputFile: undefined,
      printModuleList: false,
      skipOutput: false
    });
  });

  test("log-file-path input", () => {
    // Arrange
    getInput.mockReturnValueOnce("log-file-path");

    //Act
    start();

    // Assert
    expect(main).toBeCalledTimes(1);
    expect(main).toHaveBeenCalledWith(
      expect.objectContaining({
        logFilePath: "log-file-path"
      })
    );
  });

  test("all inputs", () => {
    // Arrange
    getInput
      .mockReturnValueOnce("log-file-path")
      .mockReturnValueOnce("output-file")
      .mockReturnValueOnce("true")
      .mockReturnValueOnce("filter")
      .mockReturnValueOnce("exclude")
      .mockReturnValueOnce("artifacts")
      .mockReturnValueOnce("false")
      .mockReturnValueOnce("debug");

    //Act
    start();

    // Assert
    expect(main).toBeCalledTimes(1);
    expect(main).toHaveBeenCalledWith(
      expect.objectContaining({
        artifacts: "artifacts",
        debug: true,
        exclude: "exclude",
        filter: "filter",
        logFilePath: "log-file-path",
        outputFile: "output-file",
        printModuleList: false,
        skipOutput: true
      })
    );
  });
});
