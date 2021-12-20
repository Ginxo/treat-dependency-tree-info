const {
  dependencyTreeToString,
  filterDependencyTree,
  getArtifactsLevelInformation,
  artifactLevelInfoToModulesLevelInfo
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
#module-a#
###########################################
whatever

`);
  });
});

describe("filterDependencyTree", () => {
  [
    {
      fileName: "simple.log",
      filter: ["jakarta.transaction-api:jar:\\d"],
      modulesToBe: ["kie-soup-commons"]
    },
    {
      fileName: "simple.log",
      filter: ["junit:junit:jar"],
      modulesToBe: ["kie-soup-commons", "kie-soup-parent"]
    },
    {
      fileName: "simple.log",
      filter: ["x:X:mar"]
    },
    {
      fileName: "simple.log",
      filter: ["org.obj.*:jar:\\d.*test"],
      modulesToBe: ["kie-soup-commons", "kie-soup-parent"]
    },
    {
      fileName: "simple.log",
      filter: [
        "junit:junit:jar",
        "org.mockito:mockito-core",
        "org.slf4j:slf4j-api"
      ],
      modulesToBe: ["kie-soup-commons"]
    },
    {
      fileName: "simple.log",
      filter: ["junit:junit:jar", "org.mockito:mockito-core"],
      modulesToBe: ["kie-soup-commons", "kie-soup-parent"]
    },
    {
      fileName: "simple.log",
      filter: ["junit:junit:jar", "org.mockito:mockito-core", "x:X:mar"]
    },
    {
      fileName: "simple.log",
      filter: [],
      modulesToBe: ["kie-soup-commons", "kie-soup-parent"]
    },
    {
      fileName: "simple.log",
      filter: undefined,
      modulesToBe: ["kie-soup-commons", "kie-soup-parent"]
    },
    {
      fileName: "simple.log",
      filter: [],
      exclude: [],
      modulesToBe: ["kie-soup-commons", "kie-soup-parent"]
    },
    {
      fileName: "simple.log",
      filter: undefined,
      exclude: undefined,
      modulesToBe: ["kie-soup-commons", "kie-soup-parent"]
    },
    {
      fileName: "simple.log",
      filter: ["x:x"],
      exclude: ["y:y"]
    },
    {
      fileName: "simple.log",
      filter: ["jakarta.transaction-api:jar:\\d"],
      exclude: ["jakarta.transaction-api:jar:\\d"]
    },
    {
      fileName: "simple.log",
      filter: ["jakarta.transaction-api:jar:\\d"],
      exclude: ["y:y"],
      modulesToBe: ["kie-soup-commons"]
    },
    {
      fileName: "simple.log",
      filter: ["junit:junit:jar", "org.mockito:mockito-core"],
      exclude: ["org.slf4j:slf4j-api"],
      modulesToBe: ["kie-soup-parent"]
    },
    {
      fileName: "simple.log",
      filter: ["junit:junit:jar", "org.mockito:mockito-core"],
      exclude: ["org.hamcrest:hamcrest-core"]
    }
  ].forEach(testCase =>
    test(`${testCase.fileName} ${testCase.filter}`, () => {
      // Arrange
      const dependencyTreeObject = getDependencyTreeObjectFromFile(
        path.join(__dirname, "..", "resources", testCase.fileName)
      );

      // Act
      const result = filterDependencyTree(
        dependencyTreeObject,
        testCase.filter,
        testCase.exclude
      );

      // Assert
      expect(
        result.length,
        `expected: ${testCase.modulesToBe} vs result:${result.map(
          e => e.moduleId
        )}`
      ).toBe(testCase.modulesToBe ? testCase.modulesToBe.length : 0);
      testCase.modulesToBe &&
        testCase.modulesToBe.forEach(moduleId =>
          expect(
            result.map(e => e.moduleId).includes(moduleId),
            `${moduleId} is not part of the result ${result.map(
              e => e.moduleId
            )}`
          ).toBe(true)
        );
    })
  );
});

describe("getArtifactsLevelInformation", () => {
  [
    { dependencyTreeObject: [], artifacts: [] },
    { dependencyTreeObject: undefined, artifacts: ["X"] },
    { dependencyTreeObject: ["X"], artifacts: undefined },
    { dependencyTreeObject: undefined, artifacts: undefined }
  ].forEach(testCase =>
    test(`dependencyTreeObject ${testCase.dependencyTreeObject}, artifacts ${testCase.artifacts}`, () => {
      // Act
      const result = getArtifactsLevelInformation(
        testCase.dependencyTreeObject,
        testCase.artifacts
      );

      // Assert
      expect(result).toStrictEqual({});
    })
  );

  test("single artifact", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );
    const artifacts = ["junit:junit"];

    // Act
    const result = getArtifactsLevelInformation(
      dependencyTreeObject,
      artifacts
    );

    // Assert
    expect(result).toStrictEqual({
      "junit:junit": {
        0: [
          {
            moduleId: "kie-soup-parent",
            artifacts: ["junit:junit:jar:4.13.1:test"]
          },
          {
            moduleId: "kie-soup-commons",
            artifacts: ["junit:junit:jar:4.13.1:test"]
          }
        ]
      }
    });
  });

  test("single artifact less restrictive", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );
    const artifacts = ["org"];

    // Act
    const result = getArtifactsLevelInformation(
      dependencyTreeObject,
      artifacts
    );

    // Assert
    expect(result).toStrictEqual({
      org: {
        0: [
          {
            moduleId: "kie-soup-parent",
            artifacts: ["org.mockito:mockito-core:jar:3.6.0:test"]
          },
          {
            moduleId: "kie-soup-commons",
            artifacts: [
              "org.slf4j:slf4j-api:jar:1.7.30:compile",
              "org.assertj:assertj-core:jar:3.14.0:test",
              "org.mockito:mockito-core:jar:3.6.0:test"
            ]
          }
        ],
        1: [
          {
            moduleId: "kie-soup-parent",
            artifacts: [
              "org.hamcrest:hamcrest-core:jar:1.3:test",
              "org.objenesis:objenesis:jar:3.1:test"
            ]
          },
          {
            moduleId: "kie-soup-commons",
            artifacts: [
              "org.hamcrest:hamcrest-core:jar:1.3:test",
              "org.objenesis:objenesis:jar:3.1:test"
            ]
          }
        ]
      }
    });
  });

  test("multiple artifacts", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );
    const artifacts = [
      "junit:junit",
      "org.slf4j:slf4j-api:jar",
      "org.hamcrest:hamcrest-core:jar"
    ];

    // Act
    const result = getArtifactsLevelInformation(
      dependencyTreeObject,
      artifacts
    );

    // Assert
    expect(result).toStrictEqual({
      "junit:junit": {
        0: [
          {
            moduleId: "kie-soup-parent",
            artifacts: ["junit:junit:jar:4.13.1:test"]
          },
          {
            moduleId: "kie-soup-commons",
            artifacts: ["junit:junit:jar:4.13.1:test"]
          }
        ]
      },
      "org.slf4j:slf4j-api:jar": {
        0: [
          {
            moduleId: "kie-soup-commons",
            artifacts: ["org.slf4j:slf4j-api:jar:1.7.30:compile"]
          }
        ]
      },
      "org.hamcrest:hamcrest-core:jar": {
        1: [
          {
            moduleId: "kie-soup-parent",
            artifacts: ["org.hamcrest:hamcrest-core:jar:1.3:test"]
          },
          {
            moduleId: "kie-soup-commons",
            artifacts: ["org.hamcrest:hamcrest-core:jar:1.3:test"]
          }
        ]
      }
    });
  });

  test("multiple levels", () => {
    // Arrange
    const dependencyTreeObject = getDependencyTreeObjectFromFile(
      path.join(__dirname, "..", "resources", "simple.log")
    );
    const artifacts = ["jakarta"];

    // Act
    const result = getArtifactsLevelInformation(
      dependencyTreeObject,
      artifacts
    );

    // Assert
    expect(result).toStrictEqual({
      jakarta: {
        0: [
          {
            moduleId: "kie-soup-commons",
            artifacts: [
              "jakarta.enterprise:jakarta.enterprise.cdi-api:jar:2.0.2:provided"
            ]
          }
        ],
        1: [
          {
            moduleId: "kie-soup-commons",
            artifacts: [
              "jakarta.el:jakarta.el-api:jar:3.0.3:provided",
              "jakarta.interceptor:jakarta.interceptor-api:jar:1.2.5:provided",
              "jakarta.inject:jakarta.inject-api:jar:1.0.3:provided"
            ]
          }
        ],
        2: [
          {
            moduleId: "kie-soup-commons",
            artifacts: [
              "jakarta.annotation:jakarta.annotation-api:jar:1.3.5:provided",
              "jakarta.ejb:jakarta.ejb-api:jar:3.2.6:provided"
            ]
          }
        ],
        3: [
          {
            moduleId: "kie-soup-commons",
            artifacts: [
              "jakarta.transaction:jakarta.transaction-api:jar:1.3.3:provided"
            ]
          }
        ]
      }
    });
  });
});

describe("artifactLevelInfoToModulesLevelInfo", () => {
  [
    {
      levelInfo: {},
      expected: {}
    },
    {
      levelInfo: undefined,
      expected: {}
    },
    {
      levelInfo: {
        jakarta: {
          0: [
            {
              moduleId: "moduleA",
              artifacts: ["JAKARTA1", "JAKARTA2"]
            },
            {
              moduleId: "moduleB",
              artifacts: ["JAKARTA1", "JAKARTA2"]
            },
            {
              moduleId: "moduleC",
              artifacts: ["JAKARTA1"]
            },
            {
              moduleId: "moduleD",
              artifacts: ["JAKARTA2"]
            },
            {
              moduleId: "moduleE",
              artifacts: []
            },
            {
              moduleId: "moduleF"
            }
          ]
        }
      },
      expected: {
        moduleA: { 0: ["JAKARTA1", "JAKARTA2"] },
        moduleB: { 0: ["JAKARTA1", "JAKARTA2"] },
        moduleC: { 0: ["JAKARTA1"] },
        moduleD: { 0: ["JAKARTA2"] }
      }
    },
    {
      levelInfo: {
        jakarta: {
          0: [
            {
              moduleId: "moduleA",
              artifacts: ["JAKARTA1", "JAKARTA2"]
            },
            {
              moduleId: "moduleB",
              artifacts: ["JAKARTA1", "JAKARTA2"]
            },
            {
              moduleId: "moduleC",
              artifacts: ["JAKARTA1"]
            },
            {
              moduleId: "moduleD",
              artifacts: ["JAKARTA2"]
            },
            {
              moduleId: "moduleE",
              artifacts: []
            },
            {
              moduleId: "moduleF"
            }
          ]
        },
        junit: {
          0: [
            {
              moduleId: "moduleA",
              artifacts: ["JUNIT1", "JUNIT2"]
            },
            {
              moduleId: "moduleB",
              artifacts: ["JUNIT1", "JUNIT2"]
            },
            {
              moduleId: "moduleC",
              artifacts: ["JUNIT1"]
            },
            {
              moduleId: "moduleD",
              artifacts: ["JUNIT2"]
            },
            {
              moduleId: "moduleE",
              artifacts: []
            },
            {
              moduleId: "moduleF"
            }
          ]
        }
      },
      expected: {
        moduleA: { 0: ["JAKARTA1", "JAKARTA2", "JUNIT1", "JUNIT2"] },
        moduleB: { 0: ["JAKARTA1", "JAKARTA2", "JUNIT1", "JUNIT2"] },
        moduleC: { 0: ["JAKARTA1", "JUNIT1"] },
        moduleD: { 0: ["JAKARTA2", "JUNIT2"] }
      }
    }
  ].forEach(testCase =>
    test(`levelInfo: ${
      testCase.levelInfo ? Object.keys(testCase.levelInfo) : undefined
    }`, () => {
      // Act
      const result = artifactLevelInfoToModulesLevelInfo(testCase.levelInfo);

      // Assert
      expect(result).toStrictEqual(testCase.expected);
    })
  );
});
