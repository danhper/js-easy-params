var wrapIt = require('./easy-params');
var expect = require('chai').expect;

describe('easy-params-generators', function () {
  function dummyFunc() {
    var args = [];
    args.push.apply(args, arguments);
    return args;
  }

  it('should work with required and optional arguments', function () {
    var base = function *(req1, req2, opt1, opt2, cb) {
      return cb(req1, req2, opt1, opt2);
    };
    var f = wrapIt(2, 'default1', 'default2', base);
    expect(f.constructor.name).to.eq('GeneratorFunction');
    expect(f(1, 2, dummyFunc).next().value).to.eql([1, 2, 'default1', 'default2']);
    expect(f(1, 2, 3, dummyFunc).next().value).to.eql([1, 2, 3, 'default2']);
    expect(f(1, 2, 3, 4, dummyFunc).next().value).to.eql([1, 2, 3, 4]);
  });

  it('should call function normally when required arguments not provided', function () {
    var base = function *(req1, req2, opt1, cb) {
      yield req1;
    };
    var f = wrapIt(2, 'default', base);
    expect(f.constructor.name).to.eq('GeneratorFunction');
    expect(f().next().value).to.eq(undefined);
    expect(f(dummyFunc).next().value).to.be.a('function');
    expect(f(1, dummyFunc).next().value).to.eq(1);
  });
});
