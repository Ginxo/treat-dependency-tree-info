#!/usr/bin/env node
const core = require("@actions/core");
const { main } = require("./main");
const args = {
  logFilePath: core.getInput("log-file-path"),
  outputFile: core.getInput("output-file"),
  skipOutput: core.getInput("skip-output") ? true : false,
  filter: core.getInput("filter"),
  exclude: core.getInput("exclude"),
  artifacts: core.getInput("artifacts")
    ? core.getInput("artifacts").split(";")
    : undefined,
  printModuleList: core.getInput("print-module-list") ? true : false,
  debug: core.getInput("logger-level") === "debug"
};
main(args);
