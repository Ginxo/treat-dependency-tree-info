const { logger } = require("../lib/logger");
const fs = require("fs");
const path = require("path");

const { dependencyTreeToString } = require("../lib/dependency-tree-service");

function printModuleList(dependencyTreeObject) {
  dependencyTreeObject && dependencyTreeObject.length
    ? logger.log(
        `\n#################### Module list ####################\n\n${dependencyTreeObject
          .map(e => `\t- ${e.moduleId}`)
          .join("\n")}\n\n`
      )
    : logger.warn(
        "The module list is empty. Either the filters are too restrictive or there's no maven dependency:tree information in log file."
      );
}

function printSummary(
  dependencyTreeObjectFiltered,
  dependencyTreeObject,
  filter,
  exclude
) {
  logger.info(
    `Filtered ${dependencyTreeObjectFiltered.length} module/s vs original ${
      dependencyTreeObject.length
    } module/s. ${filter ? `Filtered by "${filter.join(", ")}"` : ""}. ${
      exclude ? `Excluded by "${exclude.join(", ")}"` : ""
    }`
  );
}

function saveOutputToFile(
  dependencyTreeObject,
  pathToOutputFile,
  skipOutput = false
) {
  if (!skipOutput) {
    const outputContent = dependencyTreeToString(dependencyTreeObject);
    fs.writeFileSync(path.join(".", pathToOutputFile), outputContent);

    logger.info(
      `Execution output saved at ${pathToOutputFile}. Number of modules: ${
        dependencyTreeObject ? dependencyTreeObject.length : 0
      }`
    );
  } else {
    logger.info(
      `Execution output not saved due to arguments. Number of modules: ${
        dependencyTreeObject ? dependencyTreeObject.length : 0
      }`
    );
  }
}

function printModulesLevelInfo(modulesLevelInfo) {
  logger.debug("modulesLevelInfo", modulesLevelInfo);
  Object.entries(modulesLevelInfo).forEach(([moduleId, levels]) => {
    logger.info(`\\ ${moduleId}`);
    [
      ...Array(
        Math.max(...Object.keys(levels)) + 1 // Max key plus 1, key is zero based and Array() is 1 based
      ).keys()
    ].forEach(level => {
      const levelMessagePrefix = `\\${"--".repeat(level + 1)}`;
      const artifacts = levels[level];
      if (!artifacts || !artifacts.length) {
        logger.info(levelMessagePrefix);
      } else {
        artifacts.forEach(artifact =>
          logger.info(`${levelMessagePrefix} ${artifact}`)
        );
      }
    });
    logger.log("");
  });
}

module.exports = {
  printModuleList,
  printSummary,
  saveOutputToFile,
  printModulesLevelInfo
};
