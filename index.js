"use strict";

var SDK = require('sprockets-sdk');
var util = require('util');

var SonosSystem = require('sonos-discovery');
var discovery = new SonosSystem({});
var SonosAPI = require('./SonosAPI.js');
var api = new SonosAPI(discovery, {});

var VOLUME = 'VOLUME';
var REPEAT = 'REPEAT';
var SHUFFLE = 'SHUFFLE';
var CROSSFADE = 'CROSSFADE';
var PLAY = 'PLAY';
var MUTE = 'MUTE';
var SONG = 'SONG';
var ARTIST = 'ARTIST';
var ALBUM = 'ALBUM';
var ALBUM_ART_URI = 'ALBUM_ART_URI';

var SonosInstance = function(id, config, services) {
    SDK.Devices.DeviceInstance.call(this, id);
    this.config = config;
    this.loggingService = services.resolve('loggingService');

    this.addSensor(new SDK.Devices.DeviceValueComponent(SONG, 'Song', SDK.DeviceType.OTHER, false));
    this.addSensor(new SDK.Devices.DeviceValueComponent(ARTIST, 'Artist', SDK.DeviceType.OTHER, false));
    this.addSensor(new SDK.Devices.DeviceValueComponent(ALBUM, 'Album', SDK.DeviceType.OTHER, false));
    this.addSensor(new SDK.Devices.DeviceValueComponent(ALBUM_ART_URI, 'Album Art', SDK.DeviceType.OTHER, false));

    this.addControl(new SDK.Devices.DeviceRangeComponent(VOLUME, 'Volume', SDK.ValueType.OTHER, 0, 100, SDK.DeviceType.VOLUME));
    this.addControl(new SDK.Devices.DeviceBooleanComponent(REPEAT, 'Repeat', SDK.DeviceType.OTHER));
    this.addControl(new SDK.Devices.DeviceBooleanComponent(SHUFFLE, 'Shuffle', SDK.DeviceType.OTHER));
    this.addControl(new SDK.Devices.DeviceBooleanComponent(CROSSFADE, 'Crossfade', SDK.DeviceType.OTHER));
    this.addControl(new SDK.Devices.DeviceBooleanComponent(PLAY, 'Play', SDK.DeviceType.OTHER));
    this.addControl(new SDK.Devices.DeviceBooleanComponent(MUTE, 'Mute', SDK.DeviceType.OTHER));

    this.addCommand(new SDK.Devices.DeviceCommand('NEXT', 'Next'));
    this.addCommand(new SDK.Devices.DeviceCommand('PREVIOUS', 'Previous'));
};

util.inherits(SonosInstance, SDK.Devices.DeviceInstance);

/*Overrides of Device Instance */

SonosInstance.prototype.start = function() {
    var that = this;
    this.unregister = api.notifyOnChange(this.config.controller, function(controller) {
        //update the data
        that._update(controller);
    });
    //grab the current values
    this._update(api.getController(this.config.controller));
};

SonosInstance.prototype.shutdown = function() {
    if (this.unregister) {
        this.unregister();
    }
};


SonosInstance.prototype.setComponentValues = function(newVals) {
    var val;
    if (newVals.controls.hasOwnProperty(VOLUME)) {
        val = newVals.controls[VOLUME].value;
        //set the val
        this.updateControlValue(VOLUME, val);
        api.setVolume(this.config.controller, val);
    }
    if (newVals.controls.hasOwnProperty(PLAY)) {
        val = newVals.controls[PLAY].value;
        //set the val
        this.updateControlValue(PLAY, val);
        api.setPlayPause(this.config.controller, val);
    }
    if (newVals.controls.hasOwnProperty(MUTE)) {
        val = newVals.controls[MUTE].value;
        //set the val
        this.updateControlValue(MUTE, val);
        api.setMuteUnmute(this.config.controller, val);
    }
    if (newVals.controls.hasOwnProperty(CROSSFADE)) {
        val = newVals.controls[CROSSFADE].value;
        //set the val
        this.updateControlValue(CROSSFADE, val);
        api.setCrossfade(this.config.controller, val);
    }
    if (newVals.controls.hasOwnProperty(SHUFFLE)) {
        val = newVals.controls[SHUFFLE].value;
        //set the val
        this.updateControlValue(SHUFFLE, val);
        api.setShuffle(this.config.controller, val);
    }
    if (newVals.controls.hasOwnProperty(REPEAT)) {
        val = newVals.controls[REPEAT].value;
        //set the val
        this.updateControlValue(REPEAT, val);
        api.setRepeat(this.config.controller, val);
    }
};

SonosInstance.prototype.invokeCommand = function(commandId) {
    if (commandId === 'NEXT') {
        api.next(this.config.controller);
    } else if (commandId === 'PREVIOUS') {
        api.previous(this.config.controller);
    }
};

/* Internal methods for control of the device */

SonosInstance.prototype._update = function(controller) {
    if (controller) {
        this.updateControlValue(VOLUME, controller.state.volume);
        this.updateControlValue(MUTE, controller.state.mute);
        this.updateControlValue(PLAY, controller.state.playbackState === 'PLAYING');
        var repeatState = controller.state.playMode.repeat;
        if (repeatState === 'none') {
            repeatState = false;
        }
        this.updateControlValue(REPEAT, repeatState);
        this.updateControlValue(SHUFFLE, controller.state.playMode.shuffle);
        this.updateControlValue(CROSSFADE, controller.state.playMode.crossfade);

        this.updateSensorValue(SONG, controller.state.currentTrack.title);
        this.updateSensorValue(ARTIST, controller.state.currentTrack.artist);
        this.updateSensorValue(ALBUM, controller.state.currentTrack.album);
        this.updateSensorValue(ALBUM_ART_URI, controller.state.currentTrack.albumArtUri ?
            controller.state.currentTrack.albumArtUri :
            controller.state.currentTrack.absoluteAlbumArtUri);
    }
};

var SonosPlugin = function() {
    SDK.Devices.DevicePlugin.call(this, 'Sonos®');
    this.setUIModule('sprockets.plugin.sonos', 'sonosUI.js');
    this.setUIConfigHTML('sonosConfig.html');
    this.setUICardHTML('sonosCard.html');
    this.addWidget(new SDK.Devices.Widget('sonos-widget', 
                                                'Sonos', 
                                                'Display status of Sonos controller',
                                                'sonosWidget.html',
                                                'sonosWidgetController'));
};

util.inherits(SonosPlugin, SDK.Devices.DevicePlugin);


SonosPlugin.prototype.createInstance = function(id, config, services) {
    return new SonosInstance(id, config, services);
};


SonosPlugin.prototype.loadConfig = function(config, callback) {
    var retVal = {
        availableControllers: []
    };
    retVal.availableControllers = api.getControllers();
    callback(retVal);
};


module.exports = new SonosPlugin();
