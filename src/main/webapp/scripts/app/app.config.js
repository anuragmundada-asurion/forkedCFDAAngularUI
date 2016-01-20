(function(){
    "use strict";

    angular.module('app').run(['$rootScope', '$document', '$http', 'env', function($rootScope, $document, $http, env) {
        $http.get("/environment/api").then(function(response) {
            env.setApi(response.data);
        });

        $rootScope.$on('$stateChangeSuccess', function() {
            $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
        });
    }]);
})();