(function() {
    "use strict";

    angular
        .module('app')
        .filter('intersect', intersectFilter);

    ////////////////

    function intersectFilter() {

        return filterExp;

        /////////////////

        function filterExp(leftArr, rightArr) {
            return leftArr.filter(function(n) {
                return rightArr.indexOf(n) != -1
            });
        }
    }
})();