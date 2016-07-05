/**
 * Created by anurag.mundada on 6/29/16.
 */
(function() {
    "use strict";

    angular
        .module('app')
        .filter('trustHtml', trustHtml);

    trustHtml.$inject = ['$sce'];

    function trustHtml($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }
})();