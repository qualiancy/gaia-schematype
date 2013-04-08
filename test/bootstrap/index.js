/*!
 * Attach chai to global should
 */

global.chai = require('chai');
global.should = global.chai.should();

/*!
 * Chai Plugins
 */

//global.chai.use(require('chai-spies'));
//global.chai.use(require('chai-http'));

/*!
 * Import project
 */

global.schema-type = require('../..');

/*!
 * Helper to load internals for cov unit tests
 */

function req (name) {
  return process.env.schema-type_COV
    ? require('../../lib-cov/schema-type/' + name)
    : require('../../lib/schema-type/' + name);
}

/*!
 * Load unexposed modules for unit tests
 */

global.__schema-type = {};
