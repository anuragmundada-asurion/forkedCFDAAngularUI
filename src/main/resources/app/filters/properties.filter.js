(function() {
    "use strict";

    angular
        .module('app')
        .filter('propsFilter', propertiesFilter);

    propertiesFilter.$inject = ['$parse'];

    ////////////////

    function propertiesFilter($parse) {

        return filterExp;

        /////////////////

        function filterExp(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var propKey = keys[i],
                            propGetter = $parse(propKey),
                            text =  props[propKey].toLowerCase();
                        if (propGetter(item).toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                    if (itemMatches)
                        out.push(item);
                });
            }
            else
                out = items;

            return out;
        }
    }
})();