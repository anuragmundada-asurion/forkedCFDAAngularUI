(function () {
    "use strict";

    angular
        .module('app')
        .factory('Dictionary', Dictionary);

    Dictionary.$inject = ['$resource', '$filter', 'appConstants'];

    /////////////

    function Dictionary($resource, $filter, appConstants) {
        return $resource('/api/dictionaries', {}, {
            query: {
                transformResponse: function(data) {
                    data = JSON.parse(data);
                    var dictionary = {};
                    angular.forEach(data, function(dictionaryJSON){
                        addDisplayValue(dictionaryJSON.elements);
                        dictionary[dictionaryJSON.id] = dictionaryJSON.elements;
                    });
                    return dictionary;
                }
            },
            toDropdown: {
                method: 'GET',
                transformResponse: function (data) {
                    data = JSON.parse(data);
                    var dictionary = {};

                    if (data.length === 1) {
                        dictionary = formatDictionary(data[0]);
                    } else if (data.length > 1) {
                        angular.forEach(data, function (dictionaryJSON) {
                            dictionary[dictionaryJSON.id] = formatDictionary(dictionaryJSON)
                        });
                    }
                    return dictionary;
                }
            }
        });

        function isSpecialDictionary(dictionaryName) {
            return !!$filter('filter')(appConstants.CORE_DICTIONARIES, dictionaryName, true).length;
        }

        function addDisplayValue(elements) {
            angular.forEach(elements, function(item){
                if(item.elements)
                    addDisplayValue(item.elements);
                item.displayValue = item.code + " - " + item.value;
            });
        }

        //  TODO Review implementation
        function formatDictionary(data) {
            var isUnique = isSpecialDictionary(data.id),
                codes = isUnique ? {} : [];
            angular.forEach(data.elements, function (parentElem) {
                if (!isUnique) {
                    pushLastItem(parentElem, codes);
                } else {
                    codes[parentElem['element_id']] = parentElem;
                }
            });
            return codes;
        }

        function pushLastItem(item, itemArray) {
            if (!angular.isArray(item.elements)) {
                item.displayValue = item.code + " - " + item.value;
                itemArray.push(item);
            }
            angular.forEach(item.elements, function (element) {
                pushLastItem(element, itemArray);
                element.parent = item;
            });
            item.elements = undefined;
            return item;
        }
    }
})();