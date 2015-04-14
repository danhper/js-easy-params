var wrapIt = require('./easy-params');
var expect = require('chai').expect;

describe('easy-params', function () {
  function dummyFunc () {
    var args = [];
    args.push.apply(args, arguments);
    return args;
  }

  it('should work with no params', function () {
    var base = function (cb) {
      return cb();
    };
    var f = wrapIt(0, base);
    expect(f(dummyFunc)).to.eql([]);
  });

  it('should work with one required argument', function () {
    var base = function (req, cb) {
      return cb(req);
    };
    var f = wrapIt(1, base);
    expect(f('req', dummyFunc)).to.eql(['req']);
  });

  it('should work with mulitple required arguments', function () {
    var base = function (req1, req2, cb) {
      return cb(req1, req2);
    };
    var f = wrapIt(2, base);
    expect(f('req1', 'req2', dummyFunc)).to.eql(['req1', 'req2']);
  });

  it('should work with one optional argument', function () {
    var base = function (opt, cb) {
      return cb(opt);
    };
    var f = wrapIt(0, 'default', base);
    expect(f(dummyFunc)).to.eql(['default']);
    expect(f('optional', dummyFunc)).to.eql(['optional']);
  });

  it('should work with mulitple optional arguments', function () {
    var base = function (opt1, opt2, cb) {
      return cb(opt1, opt2);
    };
    var f = wrapIt(0, 'default1', 'default2', base);
    expect(f(dummyFunc)).to.eql(['default1', 'default2']);
    expect(f('optional', dummyFunc)).to.eql(['optional', 'default2']);
    expect(f('optional1', 'optional2', dummyFunc)).to.eql(['optional1', 'optional2']);
  });

  it('should work with required and optional arguments', function () {
    var base = function (req1, req2, opt1, opt2, cb) {
      return cb(req1, req2, opt1, opt2);
    };
    var f = wrapIt(2, 'default1', 'default2', base);
    expect(f(1, 2, dummyFunc)).to.eql([1, 2, 'default1', 'default2']);
    expect(f(1, 2, 3, dummyFunc)).to.eql([1, 2, 3, 'default2']);
    expect(f(1, 2, 3, 4, dummyFunc)).to.eql([1, 2, 3, 4]);
  });

  it('should call function normally when required arguments not provided', function () {
    var base = function (req1, req2, opt1, cb) {
      return req1;
    };
    var f = wrapIt(2, 'default', base);
    expect(f()).to.eq(undefined);
    expect(f(dummyFunc)).to.be.a('function');
    expect(f(1, dummyFunc)).to.eq(1);
  });

  it('should not share default values across calls', function () {
    var base = function (req1, opt1, opt2, cb) {
      opt1[req1] = 'ok';
      opt2.push('ok');
      return cb(opt1, opt2);
    };
    var opt1 = {foo: 'ok'};
    var opt2 = ['ok'];
    var f = wrapIt(1, opt1, opt2, base);

    expect(f('bar', dummyFunc)).to.eql([{foo: 'ok', bar: 'ok'}, ['ok', 'ok']]);
    expect(opt1).to.eql({foo: 'ok'});
    expect(opt2).to.eql(['ok']);
  });
});
