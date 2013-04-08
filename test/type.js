describe('mixin', function () {
  it('should mixin all methods', function () {
    var keys = Object.keys(SchemaType.prototype);
    function Noop () {};
    SchemaType('custom', Noop.prototype);
    keys.forEach(function (key) {
      Noop.should.respondTo(key);
    });
  });
});

describe('usage', function () {

  function CustomType () {}
  SchemaType('custom', CustomType.prototype);

  CustomType.prototype._validate = function (value, spec) {
    this.assert(
        'string' === typeof value
      , 'Expected type to be a string but got ' + typeof value + '.'
      , {
            actual: typeof value
          , expected: value
          , operator: '==='
        }
    );
  };

  CustomType.prototype._cast = function (value, spec) {
    var scen = spec && spec.case
        ? spec.case
        : null;

    return scen === 'upper'
      ? value.toUpperCase()
      : value;
  };

  var str = new CustomType()
    , TEST_STR = 'heLLo UniVerse'
    , TEST_STR_UPPER = 'HELLO UNIVERSE';

  describe('new CustomType()', function () {
    it('should assign "name" property', function () {
      str.should.have.property('name', 'custom');
    });
  });

  describe('.rejected()', function () {
    it('should return null on pass', function () {
      should.equal(str.rejected(TEST_STR), null);
    });

    it('should return error on fail', function () {
      var err = str.rejected(42);
      should.exist(err);
      err.should.be.instanceof(Error);
      err.should.have.property('name', 'AssertionError');
    });
  });

  describe('.valid()', function () {
    it('should return true on pass', function () {
      str.valid(TEST_STR).should.equal.true;
    });

    it('should return false on fail', function () {
      str.valid(42).should.equal.false;
    });
  });

  describe('.cast()', function () {
    it('should return the correct value', function () {
      str.cast(TEST_STR, { case: 'upper' }).should.equal(TEST_STR_UPPER);
      str.cast(TEST_STR, { case: 'other' }).should.equal(TEST_STR);
    });

    it('should throw if validation error', function () {
      (function () {
        res = str.cast(42, { case: 'upper' });
      }).should.throw('Expected type to be a string but got number.');
    });

    it('should not validate with third argument', function () {
      str.cast(42, { case: 'other' }, false).should.equal(42);
      (function () {
        str.cast(42, { case: 'upper' }, false);
      }).should.throw(/toUpperCase/);
    });
  });

});