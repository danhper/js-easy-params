module.exports = function () {
  var baseArgs = [];
  baseArgs.push.apply(baseArgs, arguments);
  var requiredArgsCount = baseArgs.shift();
  var callee = baseArgs.pop();

  return function () {
    if (arguments.length < requiredArgsCount) {
      return callee.apply(this, arguments);
    }

    var i;
    var args = [];
    args.push.apply(args, arguments);

    var calleeArgs = [];
    var cb = null;

    if (typeof args[args.length - 1] === 'function') {
      cb = args.pop();
    }

    for (i = 0; i < requiredArgsCount; i++) {
      calleeArgs.push(args.shift());
    }

    for (i = 0; i < baseArgs.length; i++) {
      if (args[i]) {
        calleeArgs.push(args[i]);
      } else {
        calleeArgs.push(baseArgs[i]);
      }
    }

    calleeArgs.push(cb);

    return callee.apply(this, calleeArgs);
  };
};
