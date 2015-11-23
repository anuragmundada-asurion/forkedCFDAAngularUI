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
        var programs = [
            {
                title: 'test 1',
                agency: 'Test Agency 1',
                office: 'Test Office 1',
                status: 'Draft'
            },
            {
                title: 'test 2',
                agency: 'Test Agency 2',
                office: 'Test Office 2',
                status: 'Draft'
            },
            {
                title: 'test 3',
                agency: 'Test Agency 3',
                office: 'Test Office 3',
                status: 'Published'
            },
            {
                title: 'test 4',
                agency: 'Test Agency 4',
                office: 'Test Office 4',
                status: 'Published'
            },
            {
                title: 'test 11',
                agency: 'Test Agency 1',
                office: 'Test Office 1',
                status: 'Published'
            }
        ];
        $httpBackend.whenGET('/_svc/programs').respond(programs);
        $httpBackend.whenGET(/\.html$/).passThrough()
    }

    function gotoNotFound($injector, $location) {
        var state = $injector.get('$state');
        state.go('404');
        return $location.path();
    }
})();