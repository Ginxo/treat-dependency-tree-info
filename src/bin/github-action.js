#!/usr/bin/env node
const core = require("@actions/core");
const { main } = require("./main");

const start = () => {
  const args = {
    logFilePath: core.getInput("log-file-path"),
    outputFile: core.getInput("output-file"),
    skipOutput: "true" === core.getInput("skip-output"),
    filter: core.getInput("filter"),
    exclude: core.getInput("exclude"),
    artifacts: core.getInput("artifacts"),
    printModuleList: "true" === core.getInput("print-module-list"),
    debug: core.getInput("logger-level") === "debug"
  };
  main(args);
};

if (require.main === module) {
  start();
}

module.exports = { start };
