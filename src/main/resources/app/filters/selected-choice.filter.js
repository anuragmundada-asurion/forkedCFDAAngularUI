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
            return items.filter(function(item) {
                return selectedChoices.indexOf(item[key]) != -1
            });
        }
    }
})();