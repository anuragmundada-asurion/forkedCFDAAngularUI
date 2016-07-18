(function () {
    "use strict";

    angular
        .module('app')
        .factory('Contact', Contact);

    Contact.$inject = ['$resource'];

    /////////////

    function Contact($resource) {
        return $resource('/v1/contact/:agencyId', {
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
                    list.push({_id:"NewContact","title":"New Contact","info":""});
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
    }
    function jsonEscape(str) {
        return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
    }
})();
