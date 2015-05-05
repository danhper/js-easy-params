# easy-params [![Build Status](https://travis-ci.org/tuvistavie/js-easy-params.svg?branch=v0.1.5)](https://travis-ci.org/tuvistavie/js-easy-params)

Decorator to easily write functions with optional arguments.
It works with both browsers and NodeJS.

With `npm`:

```sh
$ npm install easy-params
```

With `bower`:

```sh
$ bower install easy-params
```

When writing Javascript, especially with NodeJS I found myself
often writing things like this (taken from [this Gist](https://gist.github.com/klovadis/2549131))

```javascript
// example function where arguments 2 and 3 are optional
var example = function(err, optionalA, optionalB, callback) {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
  }
  err = args.shift();
  callback = args.pop();
  if (args.length > 0) optionalA = args.shift(); else optionalA = 'default';
  if (args.length > 0) optionalB = args.shift(); else optionalB = null;

  // use your arguments
}
```

to check for optional arguments. It is neither clean, nor easy to understand,
and it is quite a pain to write it all the time,
so I wrote this little decorator to avoid writing the same thing all the time.

The above example then becomes:

```javascript
var withDefaults = require('easy-params');

var example = withDefaults(1, 'default', null, function (err, optionalA, optionalB, callback) {
  // use your arguments
});
```

The first parameter is the number of required arguments, and the last
parameter is the function to wrap. All the parameters in between are the
default values for the optional paremeters.

ECMA6 generators functions are also supported when available, so you
can write somehting like:

```javascript
var withDefaults = require('easy-params');

var example = withDefaults(1, 'default', null, function *(req, optionalA, optionalB) {
  // use your arguments
});
```

and it will return a generator function with the arguments you need.
