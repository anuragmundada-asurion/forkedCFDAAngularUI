(function(){
    "use strict"

    angular
        .module('app')
        .config(configure)
        .run(runApp); // Temporary

    configure.$inject = ['$urlRouterProvider'];

    gotoNotFound.$inject = ['$injector', '$location'];

    //////////////////

    function configure($urlRouterProvider) {
        $urlRouterProvider.otherwise(gotoNotFound);
    }

    //Temporary Function
    function runApp($httpBackend) {
        $httpBackend.whenGET('/programs').respond([]);
        $httpBackend.whenGET(/\.html$/).passThrough()
    }

    function gotoNotFound($injector, $location) {
        var state = $injector.get('$state');
        state.go('404');
        return $location.path();
    }
})();