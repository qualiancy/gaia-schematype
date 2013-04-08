/*!
 * Gaia - SchemaType
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var debug = require('sherlock')('gaia-schematype')
  , AssertionError = require('assertion-error')
  , extend = require('tea-extend');

/*!
 * Primary export
 */

module.exports = SchemaType;

/**
 * SchemaType
 *
 * This is the base for all Gaia Schema data
 * types. This class should not be used directly
 * but extended.
 *
 * @param {String} name of type
 * @param {Object} validation specs
 * @param {Mixed} value to cast
 */

function SchemaType (name, spec, value) {
  this.name = name;
  this.spec = spec;
  this.value = value;
  debug('(%s) constructed', name);
}

/**
 * #### .mixin (obj)
 *
 * Mixin the SchemaType methods without inheritance.
 *
 * ```js
 * function CustomType (spec, value) {
 *   SchemaType.call(this, 'custom', spec, value);
 * }
 *
 * SchemaType.mixin(CustomType.prototype);
 * ```
 *
 * @param {Object} object to mixin
 * @api public
 */

SchemaType.mixin = function (obj) {
  for (var key in SchemaType.prototype) {
    obj[key] = SchemaType.prototype[key];
  }

  return obj;
};

/**
 * ### .valid ()
 *
 * Invoke the validation rules of this data type. Will
 * return `true` or `false` depending on whether the
 * validation rules pass or fail.
 *
 * If you need to know what validation aspect failed,
 * use `.rejected()` instead.
 *
 * ```js
 * if (data.valid()) {
 *   // all good
 * }
 * ```
 *
 * @return {Boolean} does validation pass
 * @api public
 */

SchemaType.prototype.valid = function () {
  return !! this.rejected();
};

/**
 * ### .rejected ()
 *
 * Invoke the validation rules of this data type. Will
 * return `null` if the data is valid or an `Error` object
 * with relevant information if there was a problem.
 *
 * If you don't need to know the reason for the reject,
 * use `.valid()` instead.
 *
 * ```js
 * var ve = data.validate();
 * if (ve) throw ve;
 * ```
 *
 * @return {null|Error} validation error
 * @api public
 */

SchemaType.prototype.rejected = function () {
  var err = null
    , name = this.name;

  // test the validation
  try {
    this._validate();
    debug('(%s) validate success', name);
  } catch (ex) {
    err = ex;
    debug('(%s) validate error: %s', name, err.message);
  }

  // return error or null
  return err;
};

/**
 * ### .export ()
 *
 * Invokes the validation then export rules of this data
 * type. Will throw validation or export rule errors if
 * they occur. Otherwise it will return the appropriate
 * data element.
 *
 * ```js
 *
 * ```
 *
 * @return {Mixed} result
 * @throw {Error} on error
 * @api public
 */

SchemaType.prototype.export = function () {
  var name = this.name
    , ve = this.rejected()
    , err, res;

  // check if valid
  if (ve) {
    debug('(%s) export error: %s', ve.message);
    throw ve;
  }

  // attempt to export
  try {
    res = this._export();
    debug('(%s) export success');
  } catch (ex) {
    err = ex;
    debug('(%s) export error: %s', name, err.message);
    throw err;
  }

  // return to sender
  return res;
};

/**
 * ### ._validate ()
 *
 * **Implementors** of custom data types need to
 * provide this method to validate their respective
 * data. Advise using `._assert()` for each validation
 * scenario or throw an `Error` if a condition is not
 * met.
 *
 * @api public
 */

SchemaType.prototype._validate = function () {
  throw new Error('_validate not implemented');
};

/**
 * ### ._validate ()
 *
 * **Implementors** of custom data types need to
 * provide this method to specify how this data
 * type should cast specific data points. For example,
 * a X/Y vector point specied as an object can be
 * exported as an array of `[ x, y ]`.
 *
 * @api public
 */

SchemaType.prototype._export = function () {
  throw new Error('_export not implemented');
};

/**
 * ### ._assert (test, message, properties)
 *
 * Validation rules by **implementors** should throw
 * errors when a condition is not met. This normalizes all
 * errors as `AssertionErrors` with the appropriate data.
 *
 * **Properties:**
 * - `actual`: the actual value for the scenario
 * - `expected`: the expected value for the scenario
 * - `operator`: how the values where compared
 *
 * ```js
 * CustomType.prototype._validate = function () {
 *   this._assert(
 *       'string' === typeof this.value
 *     , 'Expected type of string but got ' + typeof this.value + '.'
 *     , {
 *           actual: typeof value
 *         , expected: 'string'
 *         , operator: '==='
 *       }
 *   );
 * };
 * ```
 *
 * @param {Mixed} truthy test
 * @param {String} error message when fail
 * @param {Object} additional properties
 * @throw {AssertionError}
 * @api public
 */

SchemaType.prototype.assert = function (test, msg, props) {
  if (test) return;

  // construct new properties
  var only = extend.include('actual', 'expected', 'operator')
    , data = only(props);

  // copy over topic
  data.topic =  this.value;

  // throw error
  throw new AssertionError(msg, data, arguments.callee);
};

