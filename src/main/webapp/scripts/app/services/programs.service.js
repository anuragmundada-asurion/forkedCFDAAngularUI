(function () {
    "use strict";

    angular
        .module('app')
        .factory('Program', Program);

    Program.$inject = ['$resource'];

    ////////////

    function Program($resource, env) {
        return $resource('/api/programs/:id', {
            id: '@_id'
        }, {
            save: {
                method: 'POST',
                transformResponse: saveUpdateTransformRes
            },
            update: {
                method: 'PUT',
                params: {
                    id: '@_id'
                },
                transformResponse: saveUpdateTransformRes
            },
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = JSON.parse(data);
                    var res = data.results,
                        list = [];
                    angular.forEach(res, function (item) {
                        angular.forEach(item, function (prop, key) {
                            if (!prop._id)
                                prop._id = key;
                            list.push(prop);
                        })
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
            },
            get: {
                transformResponse: function (data) {
                    data = JSON.parse(data);
                    var returnData = null;
                    angular.forEach(data, function (prop, key) {
                        if (!prop._id)
                            prop._id = key;
                        returnData = prop;
                    });
                    return returnData;
                }
            }
        })
    }

    function saveUpdateTransformRes(data) {
        return {
            _id: data
        };
    }
})();
