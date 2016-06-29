(function(){
    "use strict";

    var myApp = angular.module('app');

    myApp.factory('HistoricalIndexFactory', ['$resource', 'ApiService', function ($resource, ApiService){
        return $resource(ApiService.APIs.historicalChangeEntity, {
            id: '@_id'
        }, {
            get: {
                method: 'GET',
                params: {
                    id: '@_id'
                }
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH',
                params: {
                    id: '@_id'
                }
            },
            delete:{
                method: 'DELETE',
                params: {
                    id: '@_id'
                }
            }
        });
    }]);
})();