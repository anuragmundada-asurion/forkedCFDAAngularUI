(function() {
    "use strict"

    angular
        .module('app')
        .factory('Program', programSvc);

    programSvc.$inject = ['$resource', 'pub.svc.programs'];

    ////////////////

    function programSvc($resource, svcUrl) {
        return $resource('http://gsaiae-dev02.reisys.com:89/program/:id', {
            id: '@id'
        }, {
            save: {
                method: 'PUT'
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