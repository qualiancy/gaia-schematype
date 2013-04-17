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
 * but extended or as a mixin.
 *
 * ```js
 * var SchemaType = require('gaia-schematype');
 *
 * // inheritance
 * function CustomType () {
 *   SchemaType.call(this, 'custom');
 * }
 *
 * inherits(CustomType, SchemaType);
 *
 * // mixin
 * function CustomType () {
 *   // nothing needed here
 * }
 *
 * SchemaType('custom', CustomType.prototype);
 * ```
 *
 * @param {String} name of type
 * @param {Object} object to mixin
 */

function SchemaType (name, obj) {
  if (obj) return mixin(name, obj);
  this.name = name;
  debug('(%s) constructed', name);
}

/*!
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
 * @api private
 */

function mixin (name, obj) {
  obj.name = name;

  for (var key in SchemaType.prototype) {
    obj[key] = SchemaType.prototype[key];
  }

  return obj;
};

/**
 * ### .rejected (value[, spec])
 *
 * Invoke the validation rules of this data type. Will
 * return `null` if the data is valid or an `Error` object
 * with relevant information if there was a problem.
 * If you don't need to know the reason for the reject,
 * use `.valid()` instead.
 *
 * ```js
 * var ve = custom.validate(value, spec);
 * if (ve) throw ve;
 * ```
 *
 * @param {Mixed} value to test
 * @param {Object} spec to validate against
 * @return {null|Error} validation error
 * @api public
 */

SchemaType.prototype.rejected = function (value, spec) {
  var err = null
    , name = this.name;

  // test the validation
  try {
    this._validate(value, spec);
    debug('(%s) validate success', name);
  } catch (ex) {
    err = ex;
    debug('(%s) validate error: %s', name, err.message);
  }

  // return error or null
  return err;
};

/**
 * ### .valid (value[, spec])
 *
 * Invoke the validation rules of this data type. Will
 * return `true` or `false` depending on whether the
 * validation rules pass or fail. If you need to know
 * what validation aspect failed, use `.rejected()` instead.
 *
 * ```js
 * if (custom.valid(value, spec)) {
 *   // all good
 * }
 * ```
 *
 * @param {Mixed} value to test
 * @param {Object} spec to validate against
 * @return {Boolean} does validation pass
 * @api public
 */

SchemaType.prototype.valid = function (value, spec) {
  return !! this.rejected(value, spec);
};

/**
 * ### .cast (value[, spec])
 *
 * Invokes the cast rules of this data type. Will throw
 * cast rule errors if they occur. Otherwise it will return
 * the appropriate data element. It is up to the user to
 * to validate beforehand.
 *
 * ```js
 * var spec = { case: 'upper' }
 *   , value = 'hello universe'
 *   , err = custom.rejected(value, spec)
 *   , res = null;
 *
 * if (!err) {
 *   try {
 *     res = custom.cast(value, spec);
 *   } catch (ex) {
 *     err = ex;
 *   }
 * }
 *
 * cb(err, res);
 * ```
 *
 * @param {Mixed} value to cast
 * @param {Object} spec to cast against
 * @return {Mixed} result
 * @throw {Error} on error
 * @api public
 */

SchemaType.prototype.cast = function (value, spec) {
  var name = this.name
    , err, res;

  // attempt to cast
  try {
    res = this._cast(value, spec);
    debug('(%s) cast success', name);
  } catch (ex) {
    err = ex;
    debug('(%s) cast error: %s', name, err.message);
    throw err;
  }

  // return to sender
  return res;
};

/**
 * ### .extect (value[, spec])
 *
 * @param {Mixed} value to extract
 * @param {Object} spec to extract against
 * @return {Mixed} result
 * @throw {Error} on error
 * @api public
 */

SchemaType.prototype.extract = function (value, spec) {
  var name = this.name
    , err, res;

  // attempt to extract
  try {
    res = this._extract(value, spec);
    debug('(%s) extract success', name);
  } catch (ex) {
    err = ex;
    debug('(%s) extract error: %s', name, err.message);
    throw err;
  }

  // return to sender
  return res;
};

/**
 * ### ._validate (value[, spec])
 *
 * **Implementors** of custom data types need to
 * provide this method to validate their respective
 * data. Advise using `._assert()` for each validation
 * scenario or throw an `Error` if a condition is not
 * met.
 *
 * @param {Mixed} value to validate
 * @param {Object} spec to validate against
 * @api public
 */

SchemaType.prototype._validate = function (value, spec) {
  throw new Error('_validate not implemented');
};

/**
 * ### ._cast (value[, spec])
 *
 * **Implementors** of custom data types need to
 * provide this method to specify how this data
 * type should cast specific data points. For example,
 * a X/Y vector point specified as an object can be
 * exported as an array of `[ x, y ]`.
 *
 * @param {Mixed} value to cast
 * @param {Object} spec to cast against
 * @api public
 */

SchemaType.prototype._cast = function (value, spec) {
  throw new Error('_export not implemented');
};

/**
 * ### ._extract (value[, spec])
 *
 * **Implementors** of custom data types need to
 * provide this method to specify how this data
 * type should extract specific data points. For example,
 * a X/Y vector point cast as an array can be extracted
 * to an object of `{ x: arr[0], y: arr[1] }`.
 *
 * @param {Mixed} value to extract
 * @param {Object} spec to extract against
 * @api public
 */

SchemaType.prototype._extract = function (value, spec) {
  throw new Error('_extract not implemented');
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

SchemaType.prototype._assert = function (test, msg, props) {
  if (test) return;

  // construct new properties
  var only = extend.include('actual', 'expected', 'operator')
    , data = only(props);

  // copy over topic
  data.topic =  this.value;

  // throw error
  throw new AssertionError(msg, data, arguments.callee);
};

