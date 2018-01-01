var rewire = require('rewire');
var util = require('util');

describe('sonos-plugin', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('createInstance should return an instance', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance).not.toBe(null);
        done();
    });

    it('createInstance should set the id', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance.id).toBe(123);
        done();
    });


    it('should create volume control', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });

        expect(instance._metadata.controls.VOLUME.controlType).toBe('range');
        expect(instance._metadata.controls.VOLUME.deviceType).toBe('volume');
        expect(instance._metadata.controls.VOLUME.monitor).toBe(true);

        done();
    });



    it('should create repeat control', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });

        expect(instance._metadata.controls.REPEAT.controlType).toBe('boolean');
        expect(instance._metadata.controls.REPEAT.deviceType).toBe('other');
        expect(instance._metadata.controls.REPEAT.monitor).toBe(true);

        done();
    });

    it('should create shuffle control', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });

        expect(instance._metadata.controls.SHUFFLE.controlType).toBe('boolean');
        expect(instance._metadata.controls.SHUFFLE.deviceType).toBe('other');
        expect(instance._metadata.controls.SHUFFLE.monitor).toBe(true);

        done();
    });

    it('should create crossfade control', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });

        expect(instance._metadata.controls.CROSSFADE.controlType).toBe('boolean');
        expect(instance._metadata.controls.CROSSFADE.deviceType).toBe('other');
        expect(instance._metadata.controls.CROSSFADE.monitor).toBe(true);

        done();
    });

    it('should create play control', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });

        expect(instance._metadata.controls.PLAY.controlType).toBe('boolean');
        expect(instance._metadata.controls.PLAY.deviceType).toBe('other');
        expect(instance._metadata.controls.PLAY.monitor).toBe(true);

        done();
    });


    it('should create mute control', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });

        expect(instance._metadata.controls.MUTE.controlType).toBe('boolean');
        expect(instance._metadata.controls.MUTE.deviceType).toBe('other');
        expect(instance._metadata.controls.MUTE.monitor).toBe(true);

        done();
    });

    it('should create next command', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance._metadata.commands.NEXT.id).toBe('NEXT');
        done();
    });


    it('should create previous command', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance._metadata.commands.PREVIOUS.id).toBe('PREVIOUS');
        done();
    });
});
