"use strict";

var request = require('sonos-discovery/lib/helpers/request');
var logger = require('sonos-discovery/lib/helpers/logger');
var uuid = require('uuid');

var SonosAPI = function(discovery, settings) {
    this.discovery = discovery;
    this.controllers = {};
    this.listeners = {};
    var that = this;
    discovery.on('transport-state', function (player) {
        //update the controller
        if (that.controllers.hasOwnProperty(player.coordinator.uuid)) {
            that.controllers[player.coordinator.uuid].state = {
                volume: player.coordinator.state.volume,
                currentTrack: player.coordinator.state.currentTrack,
                nextTrack: player.coordinator.state.nextTrack,
                mute: player.coordinator.state.mute,
                playbackState: player.coordinator.state.playbackState,
                playMode: player.coordinator.state.playMode
            };
            that._notify(that.controllers[player.coordinator.uuid]);
        }
    });

    discovery.on('topology-change', function (topology) {
        for (var i=0; i < topology.length; ++i) {
            var controller = {
                id: topology[i].uuid,
                name: topology[i].coordinator.roomName,
                state: {
                    volume: topology[i].coordinator.state.volume,
                    currentTrack: topology[i].coordinator.state.currentTrack,
                    nextTrack: topology[i].coordinator.state.nextTrack,
                    mute: topology[i].coordinator.state.mute,
                    playbackState: topology[i].coordinator.state.playbackState,
                    playMode: topology[i].coordinator.state.playMode
                }
            };
            that.controllers[controller.id] = controller;
            that._notify(controller);
        }
    });

    discovery.on('volume-change', function (volumeChange) {
        //update the controller
        if (that.controllers.hasOwnProperty(volumeChange.uuid)) {
            if (that.controllers[volumeChange.uuid].state.volume !== volumeChange.newVolume) {
                that.controllers[volumeChange.uuid].state.volume = volumeChange.newVolume;
                that._notify(that.controllers[volumeChange.uuid]);
            }
        }
    });

    discovery.on('mute-change', function (muteChange) {
        //update the controller
        if (that.controllers.hasOwnProperty(muteChange.uuid)) {
            if (that.controllers[muteChange.uuid].state.mute !== muteChange.newMute) {
                that.controllers[muteChange.uuid].state.mute = muteChange.newMute;
                that._notify(that.controllers[muteChange.uuid]);
            }
        }
    });
};

SonosAPI.prototype.getControllers = function() {
    var retVal = [];
    for (var k in this.controllers) {
        retVal.push(this.controllers[k]);
    }
    return retVal;
};


SonosAPI.prototype.getController = function(id) {
    if (this.controllers.hasOwnProperty(id)) {
        return this.controllers[id];
    }
    return null;
};



SonosAPI.prototype.notifyOnChange = function(id, callback) {
    if (!this.listeners.hasOwnProperty(id)) {
        this.listeners[id] = [];
    }
    var registration = {
        callbackId: uuid(),
        callback: callback
    };
    this.listeners[id].push(registration);
    return (function(inst, controllerId, callbackId) {
        //remove the listener
        return function() {
            if (inst.listeners.hasOwnProperty(controllerId)) {
                for (var i = 0; i < inst.listeners[controllerId].length; ++i) {
                    if (inst.listeners[controllerId][i].callbackId === callbackId) {
                        inst.listeners[controllerId].splice(i, 1);
                        break;
                    }
                }
            }
        };

    })(this, id, registration.callbackId);
};

SonosAPI.prototype.setVolume = function(controller, volume) {
    var player = this.discovery.getPlayerByUUID(controller);
    player.coordinator.setGroupVolume(volume);
};

SonosAPI.prototype.setPlayPause = function(controller, play) {
    var player = this.discovery.getPlayerByUUID(controller);
    if (play) {
        return player.coordinator.play();
    } else {
        return player.coordinator.pause();
    }
};


SonosAPI.prototype.setMuteUnmute = function(controller, mute) {
    var player = this.discovery.getPlayerByUUID(controller);
    if (mute) {
        return player.coordinator.muteGroup();
    } else {
        return player.coordinator.unMuteGroup();
    }
};


SonosAPI.prototype.setCrossfade = function(controller, val) {
    var player = this.discovery.getPlayerByUUID(controller);
    player.coordinator.crossfade(val);
};

SonosAPI.prototype.setShuffle = function(controller, val) {
    var player = this.discovery.getPlayerByUUID(controller);
    player.coordinator.shuffle(val);
};

SonosAPI.prototype.setRepeat = function(controller, val) {
    var setting = val ? "all" : "none";
    var player = this.discovery.getPlayerByUUID(controller);
    player.coordinator.repeat(setting);
};

SonosAPI.prototype.next = function(controller) {
    var player = this.discovery.getPlayerByUUID(controller);
    player.coordinator.nextTrack();
};

SonosAPI.prototype.previous = function(controller) {
    var player = this.discovery.getPlayerByUUID(controller);
    player.coordinator.previousTrack();
};

SonosAPI.prototype._notify = function(controller) {
    if (this.listeners.hasOwnProperty(controller.id)) {
        for (var i = 0; i < this.listeners[controller.id].length; ++i) {
            this.listeners[controller.id][i].callback(controller);
        }
    }
};

module.exports = SonosAPI;