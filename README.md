# gaia-schematype [![Build Status](https://travis-ci.org/qualiancy/gaia-schematype.png?branch=master)](https://travis-ci.org/qualiancy/gaia-schematype)

> Base constructor for all gaia-schema data types.

## Installation

### Node.js

`gaia-schematype` is available on [npm](http://npmjs.org).

    $ npm install gaia-schematype

### Component

`gaia-schematype` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/gaia-schematype

## Usage

* **@param** _{String}_ name of type
* **@param** _{Object}_ object to mixin
* **@param** _{Object}_ validation specs
* **@param** _{Mixed}_ value to cast

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


### .valid (value[, spec])

* **@param** _{Mixed}_ value to test
* **@param** _{Object}_ spec to validate against
* **@return** _{Boolean}_  does validation pass

Invoke the validation rules of this data type. Will
return `true` or `false` depending on whether the
validation rules pass or fail.

If you need to know what validation aspect failed,
use `.rejected()` instead.

```js
if (data.valid()) {
  // all good
}
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
var ve = data.validate();
if (ve) throw ve;
```


### .cast (value[, spec])

* **@param** _{Mixed}_ value to test
* **@param** _{Object}_ spec to validate against
* **@param** _{Boolean}_ validate before cast (default: `true`)
* **@return** _{Mixed}_  result

Invokes the validation then cast rules of this data
type. Will throw validation or cast rule errors if
they occur. Otherwise it will return the appropriate
data element.

```js
var spec = { case: 'upper' }
  , value = 'hello universe'
  , err = null
  , res;

// with cast validation
try {
  res = custom.cast(value, spec);
} catch (ex) {
  err = ex;
}

// without cast validation
if (custom.valid(value, spec)) {
  res = custom.cast(value, spec, false);
} else {
  err = custom.rejected(value, spec);
}
```


### ._validate (value[, spec])

* **@param** _{Mixed}_ value to test
* **@param** _{Object}_ spec to validate against

**Implementors** of custom data types need to
provide this method to validate their respective
data. Advise using `._assert()` for each validation
scenario or throw an `Error` if a condition is not
met.


### ._cast (value[, spec])

* **@param** _{Mixed}_ value to test
* **@param** _{Object}_ spec to validate against

**Implementors** of custom data types need to
provide this method to specify how this data
type should cast specific data points. For example,
a X/Y vector point specied as an object can be
exported as an array of `[ x, y ]`.


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

Copyright (c) 2012 Jake Luer <jake@qualiancy.com> (http://qualiancy.com)

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
