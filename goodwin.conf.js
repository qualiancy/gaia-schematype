module.exports = function(config) {
  config.set({
    globals: {
      SchemaType: require('./index')
    },

    tests: [
      'test/*.js'
    ]
  });
};
