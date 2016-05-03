!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('RequestFactory', ['$resource', 'ApiService',
        function($resource, ApiService) {
            return $resource(ApiService.APIs.programRequestEntity, {
                    id: '@_id'
                }, {
                    get: {}
                }
            );
        }
    ]);
}();