(function() {
    "use strict";

    angular
        .module('app.bootstrap', ['ng'])
        .factory('bootstrap', bootstrap);

    bootstrap.$inject = ['$document', '$http', '$q'];

    //////////////

    function bootstrap($document, $http, $q) {
        //var initInjector = angular.injector(['ng']),
        //    $window = initInjector.get('$window');

        return {
            run: run
        };

        ////////////

        function run() {
            return loadEnvVariables().then(bootstrapApplication);
        }

        function loadEnvVariables() {
            //var $http = initInjector.get('$http');
            return $http.get("/environment/api").then(function (response) {
                angular.module('app').constant('env', response.data);
            });
        }

        function bootstrapApplication() {
            angular.element($document).ready(function () {
                angular.bootstrap($document, ['app']);
            });
        }
    }
})();