configurations [![Build Status](https://travis-ci.org/zaphod1984/configurations.png)](https://travis-ci.org/zaphod1984/configurations)
=======

[![NPM](https://nodei.co/npm/configurations.png)](https://nodei.co/npm/configurations/)

[![NPM](https://nodei.co/npm-dl/configurations.png?months=3)](https://nodei.co/npm/configurations/)

Loads configuration files depending on the environment, the users individual configuration, additional configuration files that are explicitly defined and CLI parameters.

## Interface

### configuration#load(baseDir, additionalParameters)

Creates a configurations hash out of serveral overlapping configuration files.

* `baseDir` the directory configurations are loaded from
* `additionalParameters` optional additional Parameters e.g. from cli arguments

## Logic

### Default Configuration

The config file `default.js` is always loaded and is the base configuration.

### Environment Configuration

The environment is used to load an additional configurations file.
Naming convention is `{environment}.js`.
The environment configuration is optional.

### User Configuration

For local development an configuration individual for every developer is useful.
Will be only loaded if the environment is `development`.
Naming convention is `user.{userName}.js`.
The user configuration is optional.

### Additional parameters

Additonal parameters can be specified via a options hash that will be merged into the configuration.
cli arguments are a possible source.

### External optional additional Configuration

Via the parameters hash the path to an additonal configurations file can be specified.
The key for the options hash os `externalconfig`.

## Example

### default.js
````javascript
module.exports = {
    foo: 'bar',
    bax: 'baz',
    spam: 'eggs'
};
````

### /foo/bar/optionalConfig.js

````javascript
module.exports = {
    spam: 'eggs222'
};
````

### Call

````javascript
var path = require('path');
var c = require('configurations');

var configuration = r.load(path.join(__dirname, '/config'), {
  bax: 'bazzzz',
  externalconfig: '/foo/bar/optionalConfig.js'
});
````

### Result 
````javascript
{
    foo: 'bar',
    bax: 'bazzzz',
    spam: 'eggs222'
}
````
## Example 2

The file `example/example.js` contains the following content:
````javascript
var configuration = configurations.load(path.join(__dirname, '/config'), {
    externalconfig: path.join(__dirname, 'config', 'optional.js'),
    foo: 'foo-cli'
});
````

Run it with the following parameters:

### #1

````bash
$ NODE_ENV=development node example/example.js
````

result:
````json
{ "a": "b", "foo": "foo-cli", "bax": "baz-development", "spam": "eggs2" }
````

### #2

````bash
$ NODE_ENV=production node example/example.js
````

result:
````json
{ "a": "b", "foo": "foo-cli", "bax": "baz-production", "spam": "eggs2" }
````

### #3

````bash
$ NODE_ENV=foo node example/example.js
````

result:
````json
{ "a": "b", "foo": "foo-cli", "bax": "baz", "spam": "eggs2" }
````
