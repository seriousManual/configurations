var path = require('path');

var expect = require('chai').expect;

var configLoader = require('../');
var TEST_FILE_BASE = path.join(__dirname, 'testFiles');

describe('configLoader', function() {
    var env, user;

    beforeEach(function() {
        var cache = require.cache;

        Object.keys(cache).forEach(function(key) {
            if(key.indexOf(TEST_FILE_BASE) > -1) {
                delete cache[key];
            }
        });

        env = process.env.NODE_ENV;
        user = process.env.USER;
    });

    afterEach(function() {
        process.env.NODE_ENV = env;
        process.env.USER = user;
    });

    it('should load the default config', function() {
        var config = configLoader.load(path.join(TEST_FILE_BASE, '/config'));

        expect(config).to.deep.equal({foo:'bar', bax: 'baz', a: {b: {c: 42, d: 23 } } });
    });

    it('should load the default config, overwritten by the environment config', function() {
        process.env.NODE_ENV = 'test';
        var config = configLoader.load(path.join(TEST_FILE_BASE, '/config2'));

        expect(config).to.deep.equal({foo:'barFromTestEnvironment', foo2: 'baar'});
    });

    it('should load the default config, overwritten by the environment config, overwritten by the user config', function() {
        process.env.NODE_ENV = 'development';
        process.env.USER = 'foouser';

        var config = configLoader.load(path.join(TEST_FILE_BASE, '/config3'));

        expect(config).to.deep.equal({foo:'barFromuser', bar: 'barFromDevelopmentEnvironment', baz: 'bax'});
    });

    it('should load the default config, overwritten by the environment config, *NOT* overwritten by the user config', function() {
        process.env.NODE_ENV = 'test';
        process.env.USER = 'foouser';

        var config = configLoader.load(path.join(TEST_FILE_BASE, '/config3'));

        expect(config).to.deep.equal({foo:'barFromTestEnvironment', bar: 'barFromTestEnvironment'});
    });

    it('should load the default config and should enhance/overwrite it with cliParms', function() {
        var config = configLoader.load(path.join(TEST_FILE_BASE, '/config'), {bax:'cliBaz', spam: 'eggs'});

        expect(config).to.deep.equal({foo:'bar', bax: 'cliBaz', spam: 'eggs', a: {b: {c: 42, d: 23 } }});
    });

    it('should load the default config and should enhance/overwrite it with deep nested cli Parms', function() {
        var config = configLoader.load(path.join(TEST_FILE_BASE, 'config'), {a: {b: {c: 48}}});

        expect(config).to.deep.equal({foo:'bar', bax: 'baz', a: {b: {c: 48, d: 23 } }});
    });

    it('should load the default config and enhance it with an "external" config file', function() {
        var externalConfigPath = path.join(TEST_FILE_BASE, '/external/external.js');
        var config = configLoader.load(path.join(TEST_FILE_BASE, 'config'), {externalconfig: externalConfigPath});

        expect(config).to.deep.equal({foo:'bar', bax: 'baz', a: {b: {c: 256, d: 1024 } }});
    });

    it('should throw on invalid external file', function() {
        expect(function() {
            configLoader.load(path.join(TEST_FILE_BASE, 'config'), {externalconfig: 'fooooooBar'});
        }).to.throw();
    });
});