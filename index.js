var fs = require('fs');
var path = require('path');

var hoek = require('hoek');

var KEY_EXTERNAL_FILE = 'externalconfig';
var KEY_DEVELOPMENT = 'development';

/**
 * very basic configuration loader
 *
 * @param baseDir
 * @param cliArgs
 * @return Object
 */
function load(baseDir, cliArgs) {
    cliArgs = cliArgs || {};

    var environment = process.env.NODE_ENV || KEY_DEVELOPMENT;
    var userName = process.env.USER || process.env.USERNAME || null;

    var pathDefault = path.join(baseDir, 'default');
    var pathEnvironment = path.join(baseDir, environment);
    var pathUser = path.join(baseDir, 'user.' + userName);

    //fail dramatically if default config is not found or the file is malformed. file name pattern: default.js
    var configuration = tryFileVariations(pathDefault);

    //checking if there's a config file named after the current environment. file name pattern: {environmentName}.js
    var pathEnvironmentExists = existsVariations(pathEnvironment);
    if (pathEnvironmentExists) {
        configuration = hoek.merge(configuration, require(pathEnvironmentExists));
    }

    //we're checking if there's a config file named after the current user, but only in development. file name pattern: user.{userName}.js
    if (environment === KEY_DEVELOPMENT) {
        var pathUserExists = existsVariations(pathUser);
        if (pathUserExists) {
            configuration = hoek.merge(configuration, require(pathUserExists));
        }
    }

    //we provide the possibility to assign the path to a external configuration file
    if (cliArgs[KEY_EXTERNAL_FILE]) {
        var externalConfigPath = cliArgs[KEY_EXTERNAL_FILE];

        if (fs.existsSync(externalConfigPath)) {
            configuration = hoek.merge(configuration, require(externalConfigPath));
        } else {
            throw new Error('supplied external config file could not be found');
        }

        delete cliArgs[KEY_EXTERNAL_FILE];
    }

    if (Object.keys(cliArgs).length > 0) {
        hoek.merge(configuration, cliArgs);
    }

    return hoek.clone(configuration);
}

function existsVariations(path) {
    var jsPath = path + '.js';
    var jsonPath = path + '.json';

    if (fs.existsSync(jsPath)) return jsPath;
    if (fs.existsSync(jsonPath)) return jsonPath;

    return false;
}

function tryFileVariations(path) {
    try {
        return require(path + '.js');
    } catch (error) {
        return require(path + '.json');
    }
}

module.exports.load = load;