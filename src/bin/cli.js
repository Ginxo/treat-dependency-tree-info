#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const { getArgumentsObject } = require("./arguments");
const {
  getDependencyTreeObjectFromFile
} = require("../lib/log-treatment-service");
const {
  dependencyTreeToString,
  filterDependencyTree
} = require("../lib/dependency-tree-service");
const { logger } = require("./logger");

function main() {
  const args = getArgumentsObject();
  logger.level = args.debug ? "debug" : "info";
  logger.debug("args", args);

  const pathToOutputFile = args.outputFile
    ? args.outputFile
    : `${path.basename(args.logFilePath)}_output.info`;
  logger.info(
    `Treating maven-dependency tree log info from ${args.logFilePath}`
  );

  const dependencyTreeObject = getDependencyTreeObjectFromFile(
    args.logFilePath
  );
  const dependencyTreeObjectFiltered = args.filter
    ? filterDependencyTree(dependencyTreeObject, args.filter)
    : dependencyTreeObject;
  logger.debug(
    `Filtered by ${args.filter}. Filtered ${dependencyTreeObjectFiltered.length} vs original ${dependencyTreeObject.length} `
  );

  const outputContent = dependencyTreeToString(dependencyTreeObjectFiltered);
  fs.writeFileSync(path.join(".", pathToOutputFile), outputContent);

  logger.info(
    `Execution output saved at ${pathToOutputFile}. Number of modules: ${
      dependencyTreeObject ? dependencyTreeObject.length : 0
    }`
  );
}

if (require.main === module) {
  main();
}
module.exports = { main };
