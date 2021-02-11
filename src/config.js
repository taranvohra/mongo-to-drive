let vars = {
  DB: '',
};

Object.keys(vars).forEach((key) => {
  if (process.env[key] === undefined)
    throw new Error(`${key} not found in ENV`);
  vars[key] = process.env[key];
});

module.exports = {
  vars,
};
