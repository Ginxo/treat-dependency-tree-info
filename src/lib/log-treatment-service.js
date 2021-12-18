const fs = require("fs");

function getDependencyTreeObject(
  logContent,
  regex = /(?<=maven-dependency-plugin:\d\.\d\.\d:tree \(default-cli\) )(@ (.*) ---)([^<]+(.*)\\-.*)/gm
) {
  const result = [];
  let match;
  while ((match = regex.exec(logContent)) !== null && match.length > 3) {
    result.push({ moduleId: match[2], info: match[3] });
  }

  return result;
}

function getDependencyTreeObjectFromFile(filePath, encoding = "utf8") {
  return getDependencyTreeObject(fs.readFileSync(filePath, encoding));
}

module.exports = { getDependencyTreeObject, getDependencyTreeObjectFromFile };
