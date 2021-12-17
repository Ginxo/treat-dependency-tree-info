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
  test("simple regex", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(
      dependencyTreeObject,
      "jakarta.transaction-api:jar:\\d"
    );

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].moduleId).toBe("kie-soup-commons");
  });

  test("a bit more complex regex", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );

    // Act
    const result = filterDependencyTree(
      dependencyTreeObject,
      "org.obj.*:jar:\\d.*test"
    );

    // Assert
    expect(result.length).toBe(2);
  });
});
