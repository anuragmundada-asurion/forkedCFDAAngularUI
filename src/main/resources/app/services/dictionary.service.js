(function() {
    "use strict"

    angular
        .module('app')
        .factory('Dictionary', dictionarySvc);

    dictionarySvc.$inject = ['$resource', 'env'];

    ////////////////

    function dictionarySvc($resource, env) {
        return $resource(env["pub.svc.programs"] + '/dictionary/:id', {
            id: '@id'
        }, {
            toDropdown: {
                method: 'GET',
                isArray: true,
                transformResponse: function(data) {
                    data = JSON.parse(data);
                    var codes = [];
                    angular.forEach(data.elements, function(parentElem){
                        angular.forEach(parentElem.elements, function(childElem){
                            childElem.parent = parentElem;
                            codes.push(childElem);
                        })
                    });
                    return codes;
                }
            }
        })
    }
})();