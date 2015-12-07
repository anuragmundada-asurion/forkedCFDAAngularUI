(function() {
    "use strict";

    angular
        .module('app')
        .factory('Program', programSvc);

    programSvc.$inject = ['$resource', 'env'];

    ////////////////

    function programSvc($resource, env) {
        return $resource(env["pub.api.programs"] + '/program/:id', {
            id: '@_id'
        }, {
            save: {
                method: 'PUT',
                transformResponse: saveUpdateTransformRes
            },
            update: {
                method: 'POST',
                params: {
                    id: '@id'
                },
                transformResponse: saveUpdateTransformRes
            },
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function(data){
                    data = JSON.parse(data);
                    var res = data.results,
                        list = [];
                    angular.forEach(res, function(item){
                        angular.forEach(item, function(prop, key){
                            if(!prop._id)
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
                }
            },
            get: {
                transformResponse: function(data) {
                    data = JSON.parse(data);
                    var returnData = null;
                    angular.forEach(data, function(prop, key){
                        if(!prop._id)
                            prop._id = key;
                        returnData = prop;
                    });
                    return returnData;
                }
            }
        })
    }

    ///////////////

    function saveUpdateTransformRes(data) {
        return {
            _id: data
        };
    }
})();