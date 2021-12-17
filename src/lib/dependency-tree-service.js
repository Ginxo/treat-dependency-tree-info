const { outputSplitModule, separationBetweenModules } = require("./constants");
const { createRegex } = require("../util/regex-util");

/**
 *
 * @param {object} dependencyTreeObject
 * @param {array} filterRegExpArray the array of regex expressions to filter by
 * @param {array} excludeRegExpArray the array of regex expressions to exclude from
 */
function filterDependencyTree(
  dependencyTreeObject,
  filterRegExpArray,
  excludeRegExpArray = []
) {
  const regExArray = filterRegExpArray
    ? filterRegExpArray.map(filterRegExp => createRegex(filterRegExp))
    : [];
  const excludeRegExArray = excludeRegExpArray
    ? excludeRegExpArray.map(filterRegExp => createRegex(filterRegExp))
    : [];
  return dependencyTreeObject
    .filter(
      dependentryTreeElement =>
        regExArray
          .map(regEx => regEx.exec(dependentryTreeElement.info))
          .filter(e => e).length === regExArray.length
    )
    .filter(
      dependentryTreeElement =>
        excludeRegExArray
          .map(regEx => regEx.exec(dependentryTreeElement.info))
          .filter(e => e).length === 0
    );
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
