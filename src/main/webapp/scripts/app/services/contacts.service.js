(function() {
    "use strict";

    angular
        .module('app')
        .factory('Contact', contactSvc);

    contactSvc.$inject = ['$resource', 'env'];

    ////////////////

    function contactSvc($resource, env) {
        var domainUrl = env["pub.api.programs"] || 'http://gsaiae-dev02.reisys.com:82';
        return $resource(domainUrl + '/contacts/:agencyId', {
            id: '@_id',
            agencyId: '@agencyId'
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
                    data = JSON.parse(jsonEscape(data));
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
            getEmails: {
                method: 'GET',
                isArray: false,
                transformResponse: function(data){
                    var data2 = JSON.parse(data);
                    return data2;
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

    function jsonEscape(str)  {
        return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
    }
})();
