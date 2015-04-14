(function () {
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
  };


  function easyParams() {
    var baseArgs = [];
    baseArgs.push.apply(baseArgs, arguments);
    var requiredArgsCount = baseArgs.shift();
    var decorated = baseArgs.pop();

    return function () {
      if (arguments.length < requiredArgsCount) {
        return decorated.apply(this, arguments);
      }

      var i;
      var args = [];
      args.push.apply(args, arguments);

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

      return decorated.apply(this, decoratedArgs);
    };
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = easyParams;
  } else {
    window.easyParams = easyParams;
  }
}());
