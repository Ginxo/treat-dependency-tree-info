const {
  dependencyTreeToString,
  filterDependencyTree
} = require("../../src/lib/dependency-tree-service");
const {
  getDependencyTreeObjectFromFile
} = require("../../src/lib/log-treatment-service");

const path = require("path");

describe("dependencyTreeToString", () => {
  test("ok", async () => {
    // Arrange
    const dependencyTree = [{ moduleId: "module-a", info: "whatever" }];

    // Act
    const result = dependencyTreeToString(dependencyTree);

    // Assert
    expect(result).toBe(`###########################################
module-a
###########################################
whatever

`);
  });
});

describe("filterDependencyTree", () => {
  test("simple regex 1 matching", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, [
      "jakarta.transaction-api:jar:\\d"
    ]);

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].moduleId).toBe("kie-soup-commons");
  });

  test("simple regex both matching", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, [
      "junit:junit:jar"
    ]);

    // Assert
    expect(result.length).toBe(2);
  });

  test("simple regex non matching", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, ["X:X:jar"]);

    // Assert
    expect(result.length).toBe(0);
  });

  test("a bit more complex regex", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, [
      "org.obj.*:jar:\\d.*test"
    ]);

    // Assert
    expect(result.length).toBe(2);
  });

  test("multiple one matching", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, [
      "junit:junit:jar",
      "org.mockito:mockito-core",
      "org.slf4j:slf4j-api"
    ]);

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].moduleId).toBe("kie-soup-commons");
  });

  test("multiple both matching", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, [
      "junit:junit:jar",
      "org.mockito:mockito-core"
    ]);

    // Assert
    expect(result.length).toBe(2);
  });

  test("multiple none matching", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, [
      "junit:junit:jar",
      "org.mockito:mockito-core",
      "x:X"
    ]);

    // Assert
    expect(result.length).toBe(0);
  });

  test("filter empty", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, []);

    // Assert
    expect(result.length).toBe(2);
  });

  test("filter undefined", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, undefined);

    // Assert
    expect(result.length).toBe(2);
  });

  test("filter && exclude empty", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, [], []);

    // Assert
    expect(result.length).toBe(2);
  });

  test("filter && exclude undefined", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(
      dependencyTreeObject,
      undefined,
      undefined
    );

    // Assert
    expect(result.length).toBe(2);
  });
});

describe("filterDependencyTree with exclude", () => {
  test("simple regex 0 matching and 1 non-existing excluded", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(dependencyTreeObject, ["x:x"], ["y:y"]);

    // Assert
    expect(result.length).toBe(0);
  });

  test("simple regex 1 matching and 1 excluded", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(
      dependencyTreeObject,
      ["jakarta.transaction-api:jar:\\d"],
      ["jakarta.transaction-api:jar:\\d"]
    );

    // Assert
    expect(result.length).toBe(0);
  });

  test("simple regex 1 matching and 1 excluded not existing excluded", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(
      dependencyTreeObject,
      ["jakarta.transaction-api:jar:\\d"],
      ["x:X"]
    );

    // Assert
    expect(result.length).toBe(1);
  });

  test("multiple both matching 1 excluded", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(
      dependencyTreeObject,
      ["junit:junit:jar", "org.mockito:mockito-core"],
      ["org.slf4j:slf4j-api"]
    );

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].moduleId).toBe("kie-soup-parent");
  });

  test("multiple both matching both excluded", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(
      dependencyTreeObject,
      ["junit:junit:jar", "org.mockito:mockito-core"],
      ["org.hamcrest:hamcrest-core"]
    );

    // Assert
    expect(result.length).toBe(0);
  });
});
