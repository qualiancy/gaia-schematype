describe('mixin', function () {
  it('should mixin all methods', function () {
    var keys = Object.keys(SchemaType.prototype);
    function Noop () {};
    SchemaType.mixin(Noop.prototype);
    keys.forEach(function (key) {
      Noop.should.respondTo(key);
    });
  });
});

describe('usage', function () {

  function CustomType (spec, value) {
    SchemaType.call(this, 'custom', spec, value);
  }

  SchemaType.mixin(CustomType.prototype);

  CustomType.prototype._validate = function () {
    var spec = this.spec
      , value = this.value;

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

  CustomType.prototype._export = function () {
    var spec = this.spec
      , value = this.value
      , scen = spec && spec.case
        ? spec.case
        : null;

    return scen === 'upper'
      ? value.toUpperCase()
      : value;
  };

  var TEST_STR = 'heLLo UniVerse'
    , TEST_STR_UPPER = 'HELLO UNIVERSE';

  describe('new CustomType()', function () {
    var spec = { spec: true }
      , str = new CustomType({ spec: true }, TEST_STR);

    it('should assign "name" property', function () {
      str.should.have.property('name', 'custom');
    });

    it('should assign "spec" property', function () {
      str.should.have.property('spec')
        .deep.equal(spec);
    });

    it('should assign "value" property', function () {
      str.should.have.property('value', TEST_STR);
    });
  });

  describe('.rejected()', function () {
    it('should return null on pass', function () {
      var str = new CustomType(null, TEST_STR);
      should.equal(str.rejected(), null);
    });

    it('should return error on fail', function () {
      var str = new CustomType(null, 42)
        , err = str.rejected();
      should.exist(err);
      err.should.be.instanceof(Error);
      err.should.have.property('name', 'AssertionError');
    });
  });

  describe('.valid()', function () {
    it('should return true on pass', function () {
      var str = new CustomType(null, TEST_STR);
      str.valid().should.equal.true;
    });

    it('should return false on fail', function () {
      var str = new CustomType(null, 42);
      str.valid().should.equal.false;
    });
  });

  describe('.export()', function () {
    it('should return the correct value', function () {
      var str1 = new CustomType({ case: 'upper' }, TEST_STR)
        , str2 = new CustomType({ case: 'other' }, TEST_STR);
      str1.export().should.equal(TEST_STR_UPPER);
      str2.export().should.equal(TEST_STR);
    });

    it('should throw if validation error', function () {
      var str = new CustomType({ case: 'upper' }, 42)
        , res;
      (function () {
        res = str.export();
      }).should.throw('Expected type to be a string but got number.');
    });
  });

});
