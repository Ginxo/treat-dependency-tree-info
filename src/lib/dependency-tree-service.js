const { outputSplitModule, separationBetweenModules } = require("./constants");
const { createRegex } = require("../util/regex-util");
const { logger } = require("./logger");

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
        `${outputSplitModule}\n#${e.moduleId}#\n${outputSplitModule}\n${e.info}${separationBetweenModules}`
    )
    .join("");
}

const matchingModulesMaps = (dependencyObject, artifactRegex) => {
  const artifacts = [];
  let match;
  while (
    (match = artifactRegex.exec(dependencyObject.info)) !== null &&
    match.length
  ) {
    artifacts.push(match[2]);
  }
  return { moduleId: dependencyObject.moduleId, artifacts };
};

function getArtifactLevelInformation(
  dependencyTreeObject,
  artifact,
  maxLevel,
  level = 0
) {
  if (level > maxLevel) {
    return {};
  }
  const levelArtifactRegex = createRegex(
    `/\\[INFO\\]\\s([\\|\\s]\\s{2}){${level}}[\\+|\\\\]-\\s(.*${artifact})/g`
  );
  const artifactRegex = createRegex(
    `/\\[INFO\\]\\s([\\|\\s]\\s{2}){${level}}[\\+|\\\\]-\\s(.*${artifact}.*)/g`
  );

  const matchingModules = dependencyTreeObject
    .filter(e => levelArtifactRegex.exec(e.info))
    .map(e => matchingModulesMaps(e, artifactRegex));

  return {
    ...{ [level]: matchingModules.length ? matchingModules : undefined },
    ...getArtifactLevelInformation(
      dependencyTreeObject,
      artifact,
      maxLevel,
      ++level
    )
  };
}

function getArtifactsLevelInformation(
  dependencyTreeObject,
  artifacts,
  maxLevel = 10
) {
  return artifacts && dependencyTreeObject
    ? artifacts.reduce((acc, artifact) => {
        const artifactLevelInformation = getArtifactLevelInformation(
          dependencyTreeObject,
          artifact,
          maxLevel
        );
        // To remove undefined keys
        Object.keys(artifactLevelInformation).forEach(
          key =>
            artifactLevelInformation[key] === undefined &&
            delete artifactLevelInformation[key]
        );
        acc[artifact] = artifactLevelInformation;
        return acc;
      }, {})
    : {};
}

function artifactLevelInfoToModulesLevelInfo(artifactLevelInfo) {
  if (!artifactLevelInfo || Object.keys(artifactLevelInfo).length === 0) {
    return {};
  } else {
    const modules = Object.keys(artifactLevelInfo).reduce(
      (acc, artifactFilter) => {
        const artifactFilterObject = artifactLevelInfo[artifactFilter];
        const moduleIdArray = Object.keys(artifactFilterObject).reduce(
          (acc, levelInfo) => {
            acc = [
              ...acc,
              ...artifactFilterObject[levelInfo].map(e => e.moduleId)
            ];
            return acc;
          },
          []
        );
        acc.push(...moduleIdArray);
        return acc;
      },
      []
    );
    logger.debug("printArtifactsLevelInformation.moduleSet", modules);

    return modules.reduce((acc, moduleId) => {
      Object.keys(artifactLevelInfo)
        .filter(
          artifactFilterKey =>
            artifactLevelInfo[artifactFilterKey] &&
            Object.keys(artifactLevelInfo[artifactFilterKey]).length
        )
        .forEach(artifactFilterKey =>
          [
            ...Array(
              Math.max(...Object.keys(artifactLevelInfo[artifactFilterKey])) + 1 // Max key plus 1, key is zero based and Array() is 1 based
            ).keys()
          ]
            .filter(
              level =>
                artifactLevelInfo[artifactFilterKey][level] &&
                artifactLevelInfo[artifactFilterKey][level]
                  .map(levelInfo => levelInfo.moduleId)
                  .includes(moduleId)
            )
            .forEach(level => {
              const artifacts = artifactLevelInfo[artifactFilterKey][level]
                .filter(levelInfo => moduleId === levelInfo.moduleId)
                .reduce((acc, curr) => {
                  curr.artifacts && acc.push(...curr.artifacts);
                  return acc;
                }, []);
              if (artifacts && artifacts.length) {
                acc[moduleId] = acc[moduleId] ? acc[moduleId] : {};
                acc[moduleId][level] = [
                  ...new Set([
                    ...(acc[moduleId][level] ? acc[moduleId][level] : []),
                    ...artifacts
                  ])
                ];
              }
            })
        );
      return acc;
    }, {});
  }
}

function getModulesLevelInfo(dependencyTreeObject, artifacts) {
  return artifactLevelInfoToModulesLevelInfo(
    getArtifactsLevelInformation(dependencyTreeObject, artifacts)
  );
}

module.exports = {
  dependencyTreeToString,
  filterDependencyTree,
  getArtifactsLevelInformation,
  artifactLevelInfoToModulesLevelInfo,
  getModulesLevelInfo
};
