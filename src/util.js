function getType(type, key, defaultSuffix) {
  if (typeof type === 'string' || type instanceof String) {
    return `${type}${defaultSuffix}`;
  }

  if (type[key] != null) {
    return type[key];
  }

  // Return undefined
}

module.exports = {
  getType,
};
