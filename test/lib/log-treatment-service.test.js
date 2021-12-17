const {
  getDependencyTreeObject,
  getDependencyTreeObjectFromFile
} = require("../../src/lib/log-treatment-service");
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

  test("simple log - time format", async () => {
    // Arrange
    const logContent = fs.readFileSync(
      path.join(__dirname, "..", "resources", "simple-time-format.log"),
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

  test("kie-soup log", async () => {
    // Arrange
    const logContent = fs.readFileSync(
      path.join(__dirname, "..", "resources", "kie-soup.log"),
      "utf8"
    );
    const expectedModules = [
      "kie-soup-parent",
      "kie-soup-commons",
      "kie-soup-xstream",
      "kie-soup-project-datamodel",
      "kie-soup-project-datamodel-api",
      "kie-soup-project-datamodel-commons",
      "kie-soup-maven-utils",
      "kie-soup-maven-support",
      "kie-soup-maven-integration",
      "kie-soup-dataset",
      "kie-soup-json",
      "kie-soup-dataset-api",
      "kie-soup-dataset-shared",
      "kie-soup-dataset-core",
      "kie-soup-dataset-sql",
      "kie-soup-dataset-sql-tests",
      "kie-soup-dataset-csv",
      "kie-soup-dataset-elasticsearch",
      "kie-soup-dataset-prometheus",
      "kie-soup-dataset-kafka"
    ];

    // Act
    const result = getDependencyTreeObject(logContent);

    // Assert
    expect(result.length).toBe(20);
    expect(
      result.map(e => e.moduleId).every(r => expectedModules.includes(r))
    ).toBe(true);
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
    expect(result.length).toBe(762);
  });

  test("empty", async () => {
    // Act
    const result = getDependencyTreeObject("");

    // Assert
    expect(result.length).toBe(0);
  });

  test("undefined", async () => {
    // Act
    const result = getDependencyTreeObject(undefined);

    // Assert
    expect(result.length).toBe(0);
  });

  test("not containing maven dependency:tree information", async () => {
    // Arrange
    const logContent = fs.readFileSync(
      path.join(__dirname, "..", "resources", "not-dependency-tree.log"),
      "utf8"
    );

    // Act
    const result = getDependencyTreeObject(logContent);

    // Assert
    expect(result.length).toBe(0);
  });
});

describe("getDependencyTreeObjectFromFile", () => {
  test("simple log", async () => {
    // Act
    const result = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Assert
    expect(result.length).toBe(2);
    expect(result).toStrictEqual([
      { moduleId: "kie-soup-parent", info: expect.any(String) },
      { moduleId: "kie-soup-commons", info: expect.any(String) }
    ]);
  });
});
