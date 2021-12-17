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
    .option(
      "-f, --filter <regex>",
      "The regex to filter just the modules' dependency:tree matching with the regex.",
      undefined
    )
    .option("-d, --debug", "to enable debug logging mode.", undefined)
    .parse();

  return { ...program.opts() };
}

module.exports = { getArgumentsObject };
