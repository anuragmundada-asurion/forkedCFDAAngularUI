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
            var arr = [];

            if(angular.isArray(leftArr) && angular.isArray(rightArr)) {
                arr = leftArr.filter(function (n) {
                    return rightArr.indexOf(n) != -1
                });
            }

            return arr;
        }
    }
})();