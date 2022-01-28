#!/usr/bin/env node
const { main } = require("./main");
const { getArgumentsObject } = require("./arguments");

const start = () => {
  main(getArgumentsObject());
};

if (require.main === module) {
  start();
}

module.exports = { start };
