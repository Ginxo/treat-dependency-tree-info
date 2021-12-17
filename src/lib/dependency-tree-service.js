const { outputSplitModule, separationBetweenModules } = require("./constants");
const { createRegex } = require("../util/regex-util");

function filterDependencyTree(dependencyTreeObject, filterRegExp) {
  const regEx = createRegex(filterRegExp);
  return dependencyTreeObject.filter(e => regEx.exec(e.info));
}

function dependencyTreeToString(dependencyTreeObject) {
  return dependencyTreeObject
    .map(
      e =>
        `${outputSplitModule}\n${e.moduleId}\n${outputSplitModule}\n${e.info}${separationBetweenModules}`
    )
    .join("");
}

module.exports = { dependencyTreeToString, filterDependencyTree };
