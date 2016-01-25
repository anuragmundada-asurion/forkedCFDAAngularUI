(function() {
    "use strict";

    angular
        .module('app')
        .filter('propsParentFilter', propertiesParentFilter);

    propertiesParentFilter.$inject = ['$parse'];

    ////////////////

    function propertiesParentFilter($parse) {

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
                            propGetter2 = $parse('parent'),
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