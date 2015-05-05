#!/bin/sh

regex="[0-9]\.([0-9]{1,2})\.[0-9]+"

node_version=`node --version`

[[ $node_version =~ $regex ]]
minor_version=${BASH_REMATCH[1]}

if [ $minor_version -ge 11 ]; then
  mocha easy-params-test.js && mocha --harmony easy-params-generators-test.js
else
  mocha easy-params-test.js
fi

exit $?
