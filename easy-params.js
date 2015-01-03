(function () {
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

      for (i = 0; i < baseArgs.length; i++) {
        if (args[i]) {
          decoratedArgs.push(args[i]);
        } else {
          decoratedArgs.push(baseArgs[i]);
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
