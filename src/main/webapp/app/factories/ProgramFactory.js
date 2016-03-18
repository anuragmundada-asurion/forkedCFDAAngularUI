(function(){
    "use strict";

    var myApp = angular.module('app');

    myApp.factory('ProgramFactory', ['$resource', 'ApiService', function ($resource, ApiService){

        return $resource(ApiService.APIs.programEntity, {
            id: '@_id'
        }, {
            save: {
                method: 'POST',
                transformResponse: function(data) {
                    return {
                        _id: data
                    };
                }
            },
            update: {
                method: 'PATCH',
                params: {
                    id: '@_id'
                },
                transformResponse: function (data) {
                    return {
                        _id: data
                    }
                }
            },
            get: {
                transformResponse: function (data) {
                    data = JSON.parse(data);
                    return data.data;
                }
            },
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = JSON.parse(data);
                    var res = data.results,
                        list = [];
                    angular.forEach(res, function (item) {
                        list.push(item);
                    });
                    list.$metadata = {
                        totalCount: data.totalCount,
                        offset: data.offset,
                        limit: data.limit
                    };
                    return list;
                },
                interceptor: {
                    response: function (response) {
                        response.resource.$metadata = response.data.$metadata;
                        return response.resource;
                    }
                }
            }
        });
    }]);
})();