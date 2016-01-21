(function () {
    "use strict";

    angular.module('app').factory('Contact', ['$resource', 'env', function ($resource, env) {
        var domainUrl = env["pub.api.programs"] || 'http://gsaiae-cfda-program-uat01.reisys.com';
        return $resource(domainUrl + '/contacts/:agencyId', {
            id: '@_id',
            agencyId: '@agencyId'
        }, {
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = JSON.parse(jsonEscape(data));
                    var res = data.results,
                        list = [];
                    angular.forEach(res, function (item) {
                        angular.forEach(item, function (prop, key) {
                            if (!prop._id) {
                                prop._id = key;
                            }
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
            }
        })
    }]);

    function jsonEscape(str) {
        return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
    }
})();
