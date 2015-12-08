(function() {
    "use strict";

    angular
        .module('app')
        .factory('Dictionary', dictionarySvc);

    dictionarySvc.$inject = ['$resource', '$filter', 'env'];

    ////////////////

    function dictionarySvc($resource, $filter, env) {
        var SPECIAL_DICTIONARIES = [
            'yes_na',
            'yes_no',
            'yes_no_na'
        ];

        return $resource(env["pub.api.programs"] + '/dictionaries/:id?callback=JSON_CALLBACK', {
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

        function isSpecialDictionary(dictionaryName) {
            return !!$filter('filter')(SPECIAL_DICTIONARIES, dictionaryName, true).length;
        }

        function formatDictionary(data) {
            var isUnique = isSpecialDictionary(data.id),
                codes = isUnique ? {} : [];
            angular.forEach(data.elements, function(parentElem){
                if(!isUnique) {
                    angular.forEach(parentElem.elements, function (childElem) {
                        childElem.parent = parentElem;
                        codes.push(childElem);
                    });
                }
                else
                    codes[parentElem.element_id] = parentElem;
            });
            return codes;
        }
    }
})();