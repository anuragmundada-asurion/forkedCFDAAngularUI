(function() {
    "use strict";

    angular
        .module('app')
        .filter('selectedChoiceFilter', selectedChoiceFilter);

    ////////////////

    function selectedChoiceFilter() {

        return filterExp;

        /////////////////

        function filterExp(items, selectedChoices, key) {
            var out = [];
            if (angular.isArray(items) && angular.isArray(selectedChoices)) {
                out = items.filter(function (item) {
                    return selectedChoices.indexOf(item[key]) != -1
                });
            }
            return out;
        }
    }
})();