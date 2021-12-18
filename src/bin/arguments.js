const { Command } = require("commander");

function getArgumentsObject() {
  const program = new Command();
  program
    .requiredOption(
      "-l, --log-file-path <filePath>",
      "The maven log file path (remember the file should contain dependency:tree plugin info)."
    )
    .option(
      "-o, --output-file <filePath>",
      'The file path to write the output information from the execution. Otherwise it will be "original file\'s base name_output.info".',
      undefined
    )
    .option("--skip-output", "To skip the file writing.")
    .option(
      "-f, --filter <regex...>",
      "The regex list to filter just the modules' dependency:tree matching with the regex.",
      undefined
    )
    .option(
      "-e, --exclude <regex...>",
      "The regex list to exclude the modules' dependency:tree matching with the regex.",
      undefined
    )
    .option(
      "-a, --artifacts <dependency identifier...>",
      "The dependency identifier list to get information from. It can be groupId, groupId:artifactId, groupId:artifactId:classifier, groupId:artifactId:classifier:version and all the combitations of them.",
      undefined
    )
    .option(
      "-p, --print-module-list",
      "It will print a summary of module lists matching the requirements from execution."
    )
    .option("-d, --debug", "to enable debug logging mode.", undefined)
    .parse();

  return { ...program.opts() };
}

module.exports = { getArgumentsObject };
