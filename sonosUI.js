angular.module('sprockets.plugin.sonos', ['sprockets', 'ui.bootstrap']);

angular.module('sprockets.plugin.sonos').controller('sonosConfigController', function($scope, pluginService) {
    $scope.validation.add('config.controller', 'controller', $scope.services.required);
    $scope.availableControllers = [];
    var loadData = function() {
        pluginService.getConfigData($scope.plugin, {}).then(function (response) {
            $scope.availableControllers = response.availableControllers;
            if ($scope.availableControllers.length > 0) {
                $scope.config.controller = $scope.availableControllers[0].id;
            }
        });
    };
    loadData();
    $scope.refresh = function() {
        loadData();
    };
});

angular.module('sprockets.plugin.sonos').controller('sonosCardController', function($scope) {
    $scope.next = function() {
        $scope.invokeCommand('NEXT');
    };
    $scope.previous = function() {
        $scope.invokeCommand('PREVIOUS');
    };
    $scope.togglePause = function() {
        $scope.setControlValue('PLAY', !$scope.values.controls['PLAY'].value);
    };
    $scope.toggleMute = function() {
        $scope.setControlValue('MUTE', !$scope.values.controls['MUTE'].value);
    };
    $scope.changeVolume = function() {
        $scope.setControlValue('VOLUME', $scope.values.controls['VOLUME'].value);
    };
});
angular.module('sprockets.plugin.sonos').controller('sonosWidgetController', function($scope, device, deviceValues, deviceControl) {
    $scope.device = device;
    $scope.values = deviceValues;
    
    $scope.next = function() {
        deviceControl.invokeCommand('NEXT');
    };
    $scope.previous = function() {
        deviceControl.invokeCommand('PREVIOUS');
    };
    $scope.togglePause = function() {
        deviceControl.setControlValue('PLAY', !$scope.values.controls['PLAY'].value);
    };
    $scope.toggleMute = function() {
        deviceControl.setControlValue('MUTE', !$scope.values.controls['MUTE'].value);
    };
    $scope.changeVolume = function() {
        deviceControl.setControlValue('VOLUME', $scope.values.controls['VOLUME'].value);
    };
});
