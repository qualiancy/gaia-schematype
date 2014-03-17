# gaia-schematype [![Build Status](https://travis-ci.org/qualiancy/gaia-schematype.png?branch=master)](https://travis-ci.org/qualiancy/gaia-schematype)

> Base constructor for all gaia-schema data types.

## Installation

### Node.js

`gaia-schematype` is available on [npm](http://npmjs.org).

    $ npm install gaia-schematype

## Usage

* **@param** _{String}_ name of type
* **@param** _{Object}_ object to mixin

This is the base for all Gaia Schema data
types. This class should not be used directly
but extended or as a mixin.

```js
var SchemaType = require('gaia-schematype');

// inheritance
function CustomType () {
  SchemaType.call(this, 'custom');
}

inherits(CustomType, SchemaType);

// mixin
function CustomType () {
  // nothing needed here
}

SchemaType('custom', CustomType.prototype);
```


### .rejected (value[, spec])

* **@param** _{Mixed}_ value to test
* **@param** _{Object}_ spec to validate against
* **@return** _{null|Error}_  validation error

Invoke the validation rules of this data type. Will
return `null` if the data is valid or an `Error` object
with relevant information if there was a problem.
If you don't need to know the reason for the reject,
use `.valid()` instead.

```js
var ve = custom.validate(value, spec);
if (ve) throw ve;
```


### .valid (value[, spec])

* **@param** _{Mixed}_ value to test
* **@param** _{Object}_ spec to validate against
* **@return** _{Boolean}_  does validation pass

Invoke the validation rules of this data type. Will
return `true` or `false` depending on whether the
validation rules pass or fail. If you need to know
what validation aspect failed, use `.rejected()` instead.

```js
if (custom.valid(value, spec)) {
  // all good
}
```


### .wrap(value[, spec])

* **@param** _{Mixed}_ value to wrap
* **@param** _{Object}_ spec to wrap against
* **@return** _{Mixed}_  result

Invokes the wrap rules of this data type. Will throw
wrap rule errors if they occur. Otherwise it will return
the appropriate data element. It is up to the user to
to validate beforehand.

```js
var spec = { case: 'upper' }
  , value = 'hello universe'
  , err = custom.rejected(value, spec)
  , res = null;

if (!err) {
  try {
    res = custom.wrap(value, spec);
  } catch (ex) {
    err = ex;
  }
}

cb(err, res);
```


### .unwrap(value[, spec])


* **@param** _{Mixed}_ value to unwrap
* **@param** _{Object}_ spec to unwrap against
* **@return** _{Mixed}_  result



### ._validate (value[, spec])

* **@param** _{Mixed}_ value to validate
* **@param** _{Object}_ spec to validate against

**Implementors** of custom data types need to
provide this method to validate their respective
data. Advise using `._assert()` for each validation
scenario or throw an `Error` if a condition is not
met.


### ._wrap(value[, spec])

* **@param** _{Mixed}_ value to wrap
* **@param** _{Object}_ spec to wrap against

**Implementors** of custom data types need to
provide this method to specify how this data
type should wrap specific data points. For example,
a X/Y vector point specified as an object can be
exported as an array of `[ x, y ]`.


### ._unwrap(value[, spec])

* **@param** _{Mixed}_ value to unwrap
* **@param** _{Object}_ spec to unwrapagainst

**Implementors** of custom data types need to
provide this method to specify how this data
type should unwrap specific data points. For example,
a X/Y vector point wrap as an array can be unwrapped
to an object of `{ x: arr[0], y: arr[1] }`.


### ._assert (test, message, properties)

* **@param** _{Mixed}_ truthy test
* **@param** _{String}_ error message when fail
* **@param** _{Object}_ additional properties

Validation rules by **implementors** should throw
errors when a condition is not met. This normalizes all
errors as `AssertionErrors` with the appropriate data.

**Properties:**
- `actual`: the actual value for the scenario
- `expected`: the expected value for the scenario
- `operator`: how the values where compared

```js
CustomType.prototype._validate = function () {
  this._assert(
      'string' === typeof this.value
    , 'Expected type of string but got ' + typeof this.value + '.'
    , {
          actual: typeof value
        , expected: 'string'
        , operator: '==='
      }
  );
};
```



## License

(The MIT License)

Copyright (c) 2013 Jake Luer <jake@qualiancy.com> (http://qualiancy.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
