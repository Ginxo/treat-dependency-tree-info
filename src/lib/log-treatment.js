function getDependencyTreeObject(logContent) {
  const result = [];
  const regex =
    /(?<=maven-dependency-plugin:\d\.\d\.\d:tree \(default-cli\) )(@ (.*) ---)([^<]+(.*))(?=\[INFO\] -------------------<)/gm;
  let match;
  while ((match = regex.exec(logContent)) !== null && match.length > 3) {
    result.push({ moduleId: match[2], info: match[3] });
  }

  return result;
}

module.exports = { getDependencyTreeObject };
