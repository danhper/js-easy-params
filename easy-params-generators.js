module.exports = function (transformArguments, decorated) {
  return function* () {
    var args = transformArguments.apply(this, arguments);
    return yield* decorated.apply(this, args);
  };
};
