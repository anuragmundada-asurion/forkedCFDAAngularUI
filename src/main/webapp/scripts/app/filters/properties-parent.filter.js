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
                        console.log("propKey = " + propKey);
                        console.log("propGetter  = " + propGetter(item).toString());
                        console.log("propGetter2 = " + propGetter2(item).toString());
                        console.log("item = " + JSON.stringify(item));
                        console.log("text = " + text);
                        if (propGetter(item).toString().toLowerCase().indexOf(text) !== -1) {
                            console.log("1) " + propGetter(item).toString());
                            //console.log("2) " + propKey.toString());
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