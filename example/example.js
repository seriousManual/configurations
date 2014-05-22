var path = require('path');

var c = require('../');

var configuration = c.load(path.join(__dirname, '/config'), {
    externalconfig: path.join(__dirname, 'config', 'optional.js'),
    foo: 'foo-cli'
});

console.log(configuration);