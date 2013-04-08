module.exports = process.env.SchemaType_COV
  ? require('./lib-cov/schematype')
  : require('./lib/schematype');
