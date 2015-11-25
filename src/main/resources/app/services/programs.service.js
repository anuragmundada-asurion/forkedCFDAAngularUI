(function() {
    "use strict"

    angular
        .module('app')
        .factory('Program', programSvc);

    programSvc.$inject = ['$resource', 'svc.programs'];

    ////////////////

    function programSvc($resource, svcUrl) {
        return $resource(svcUrl + '/program/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function(data){
                    data = JSON.parse(data);
                    var res = data.results,
                        list = [];
                    angular.forEach(res, function(item){
                        angular.forEach(item, function(prop, key){
                            prop.id = key;
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
            }
        });
    }
})();