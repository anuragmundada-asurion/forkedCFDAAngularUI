(function() {
    "use strict"

    angular
        .module('app')
        .factory('Dictionary', dictionarySvc);

    dictionarySvc.$inject = ['$resource', 'env'];

    ////////////////

    function dictionarySvc($resource, env) {
        return $resource(env["pub.svc.programs"] + '/dictionaries/:id', {
            id: '@id'
        }, {
            toDropdown: {
                method: 'GET',
                transformResponse: function(data) {
                    data = JSON.parse(data);
                    var dictionary = {};

                    if(data.length === 1)
                        dictionary = formatDictionary(data[0]);
                    else if(data.length > 1) {
                        angular.forEach(data, function(dictionaryJSON){
                            dictionary[dictionaryJSON.id] = formatDictionary(dictionaryJSON)
                        });
                    }
                    return dictionary;
                }
            }
        });

        ///////////////////////

        function formatDictionary(data) {
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
})();