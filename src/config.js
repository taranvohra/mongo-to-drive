let config = {
  DB: '',
};

Object.keys(config).forEach((key) => {
  if (process.env[key] === undefined)
    throw new Error(`${key} not found in ENV`);
  config[key] = process.env[key];
});

module.exports = {
  config,
};
