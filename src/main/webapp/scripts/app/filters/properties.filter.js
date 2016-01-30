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
            var out = items;

            if (angular.isArray(items) && angular.isObject(props)) {
                var keys = Object.keys(props);
                if(keys.length > 0) {
                    out = [];
                    items.forEach(function (item) {
                        var itemMatches = false;

                        for (var i = 0; i < keys.length && !itemMatches; i++) {
                            var propKey = keys[i],
                                propGetter = $parse(propKey),
                                text = props[propKey].toString().toLowerCase();
                            itemMatches = propGetter(item).toString().toLowerCase().indexOf(text) !== -1;
                        }
                        if (itemMatches)
                            out.push(item);
                    });
                }
            }
            return out;
        }
    }
})();