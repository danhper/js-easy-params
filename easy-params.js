(function () {
  var makeGenerator;

  (function () {
    /* jshint evil:true */
    try {
      eval("(function *(){})");
      makeGenerator = require('./easy-params-generators');
    } catch(e) {}
  })();


  function clone(obj) {
    var type = typeof obj;
    if (!(type === 'function' || type === 'object' && !!obj)) {
        return obj;
    }

    var temp = obj.constructor();
    for (var key in obj) {
      temp[key] = clone(obj[key]);
    }

    return temp;
  }


  function easyParams() {
    var baseArgs = [].slice.apply(arguments);
    var requiredArgsCount = baseArgs.shift();
    var decorated = baseArgs.pop();

    function transformArguments() {
      if (arguments.length < requiredArgsCount) {
        return arguments;
      }

      var i;
      var args = [].slice.apply(arguments);

      var decoratedArgs = [];
      var cb = null;

      if (typeof args[args.length - 1] === 'function') {
        cb = args.pop();
      }

      for (i = 0; i < requiredArgsCount; i++) {
        decoratedArgs.push(args.shift());
      }

      var l = baseArgs.length;
      for (i = 0; i < l; i++) {
        if (args[i]) {
          decoratedArgs.push(args[i]);
        } else {
          decoratedArgs.push(clone(baseArgs[i]));
        }
      }

      decoratedArgs.push(cb);
      return decoratedArgs;
    }

    if (decorated.constructor.name === 'GeneratorFunction') {
      return makeGenerator(transformArguments, decorated);
    } else {
      return function () {
        var args = transformArguments.apply(this, arguments);
        return decorated.apply(this, args);
      };
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = easyParams;
  } else {
    window.easyParams = easyParams;
  }
}());
