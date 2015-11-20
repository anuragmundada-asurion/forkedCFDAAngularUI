(function() {
    "use strict"

    angular
        .module('app')
        .factory('Program', programSvc);

    programSvc.$inject = ['$resource'];

    ////////////////

    function programSvc($resource) {
        return $resource('/_svc/programs/:id', {
            id: '@id'
        });
    }
})();