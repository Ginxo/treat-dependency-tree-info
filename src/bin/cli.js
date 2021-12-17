#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const { getDependencyTreeObject } = require("../lib/log-treatment");
const {
  outputSplitModule,
  separationBetweenModules
} = require("../lib/constants");

const cliArgs = process.argv.slice(2);
if (cliArgs.length !== 1) {
  console.error(
    "There path to file is an expected argument to execute the script. Please execute it like ./index.js path/to/the/file"
  );
} else {
  const pathToLogFile = cliArgs[0];
  const pathToOutputFile = `${path.basename(pathToLogFile)}_output.info`;
  console.log(`Treating maven-dependency tree log info from ${pathToLogFile}`);
  const logContent = fs.readFileSync(pathToLogFile, "utf8");
  const dependencyTreeObject = getDependencyTreeObject(logContent);
  const outputContent = dependencyTreeObject
    .map(
      e =>
        `${outputSplitModule}\n${e.moduleId}\n${outputSplitModule}\n${e.info}${separationBetweenModules}`
    )
    .join("");
  fs.writeFileSync(path.join(".", pathToOutputFile), outputContent);

  console.log(`Execution output saved at ${pathToOutputFile}`);
}
