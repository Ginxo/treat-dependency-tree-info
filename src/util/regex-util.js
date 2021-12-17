function createRegex(str) {
  const [, literal, flag] = str.split("/");
  return literal
    ? flag
      ? new RegExp(literal, flag)
      : new RegExp(literal)
    : new RegExp(str);
}

module.exports = { createRegex };
