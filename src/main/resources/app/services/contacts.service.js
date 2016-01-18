(function() {
    "use strict";

    angular
        .module('app')
        .factory('Contact', contactSvc);

    contactSvc.$inject = ['$resource', 'env'];

    ////////////////

    function contactSvc($resource, env) {
        //var domainUrl = env["pub.api.contacts"] || 'http://gsaiae-cfda-program-uat01.reisys.com';
        //var domainUrl = 'http://localhost:8081/contacts/c74dcc34429094ce44b6c9a9b7dc6b8e';
        var domainUrl = 'http://localhost:8081';
        //return $resource(domainUrl + '/contacts/:id', {
        return $resource(domainUrl + '/contacts/c74dcc34429094ce44b6c9a9b7dc6b8e', {
            id: '@_id'
        }, {
            save: {
                method: 'PUT',
                transformResponse: saveUpdateTransformRes
            },
            update: {
                method: 'POST',
                params: {
                    id: '@_id'
                },
                transformResponse: saveUpdateTransformRes
            },
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function(data){
                    console.log("Inside contacts.service.js - query");
                    console.log("data1: " + data);
                    data = JSON.parse(data);
                    console.log("data2: " + data);
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
                },
                interceptor: {
                    response: function (response) {
                        response.resource.$metadata = response.data.$metadata;
                        return response.resource;
                    }
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
