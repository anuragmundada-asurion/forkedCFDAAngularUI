(function(){
    "use strict";

    var myApp = angular.module('app');

    myApp.factory('RegionalOfficeFactory', ['$resource', 'ApiService', function ($resource, ApiService){
        return $resource(ApiService.APIs.regionalOfficeEntity, {
                id: '@_id'
            }, {
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT',
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