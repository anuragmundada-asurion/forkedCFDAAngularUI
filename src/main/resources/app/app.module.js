(function(){
    "use strict"

    var requiredModules = [
        'ngAnimate',
        'ngResource',
        'ngTouch',
        'ui.router',
        'duScroll',
        'smart-table'
    ];

    //Temporary until Programs service is created
    requiredModules.push('ngMockE2E');

    angular.module('app', requiredModules);
})();