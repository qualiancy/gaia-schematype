module.exports = process.env.schema-type_COV
  ? require('./lib-cov/schema-type')
  : require('./lib/schema-type');
