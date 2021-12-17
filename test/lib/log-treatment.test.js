const { getDependencyTreeObject } = require("../../src/lib/log-treatment");
const fs = require("fs");
const path = require("path");

describe("getDependencyTreeObject", () => {
  test("simple log", async () => {
    // Arrange
    const logContent = fs.readFileSync(
      path.join(__dirname, "..", "resources", "simple.log"),
      "utf8"
    );

    // Act
    const result = getDependencyTreeObject(logContent);

    // Assert
    expect(result.length).toBe(2);
    expect(result).toStrictEqual([
      { moduleId: "kie-soup-parent", info: expect.any(String) },
      { moduleId: "kie-soup-commons", info: expect.any(String) }
    ]);
  });
  test("partial log", async () => {
    // Arrange
    const logContent = fs.readFileSync(
      path.join(__dirname, "..", "resources", "partial.log"),
      "utf8"
    );

    // Act
    const result = getDependencyTreeObject(logContent);

    // Assert
    expect(result.length).toBe(56);
  });
});
