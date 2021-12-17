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

function printModuleList(dependencyTreeObject) {
  if (dependencyTreeObject && dependencyTreeObject.length) {
    logger.log(
      `\n#################### Module list ####################\n\n${dependencyTreeObject
        .map(e => `\t- ${e.moduleId}`)
        .join("\n")}\n\n`
    );
  } else {
    logger.warn(
      "The module list is empty. Either the filters are too restrictive or there's no maven dependency:tree information in log file."
    );
  }
}

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
  const dependencyTreeObjectFiltered = filterDependencyTree(
    dependencyTreeObject,
    args.filter,
    args.exclude
  );
  if (args.printModuleList) {
    printModuleList(dependencyTreeObjectFiltered);
  }

  logger.info(
    `Filtered ${dependencyTreeObjectFiltered.length} module/s vs original ${
      dependencyTreeObject.length
    } module/s. ${
      args.filter ? `Filtered by "${args.filter.join(", ")}"` : ""
    }. ${args.exclude ? `Excluded by "${args.exclude.join(", ")}"` : ""}`
  );

  if (!arguments.skipOutput) {
    const outputContent = dependencyTreeToString(dependencyTreeObjectFiltered);
    fs.writeFileSync(path.join(".", pathToOutputFile), outputContent);

    logger.info(
      `Execution output saved at ${pathToOutputFile}. Number of modules: ${
        dependencyTreeObjectFiltered ? dependencyTreeObjectFiltered.length : 0
      }`
    );
  } else {
    logger.info(
      `Execution output not saved due to arguments. Number of modules: ${
        dependencyTreeObjectFiltered ? dependencyTreeObjectFiltered.length : 0
      }`
    );
  }
}

if (require.main === module) {
  main();
}
module.exports = { main };
