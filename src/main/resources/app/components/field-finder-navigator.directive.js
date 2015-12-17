(function() {
    "use strict";

    angular
        .module('app')
        .directive('fieldFinderNavigator', fieldFinderNavigator);

    fieldFinderNavigator.$inject = ['$document', '$timeout'];

    //////////////////

    function fieldFinderNavigator($document, $timeout) {
        return {
            restrict: 'AE',
            require: '^fieldFinderForm',
            link: link,
            scope: false,
            templateUrl: 'partials/components/field-finder-navigator.tpl.html'
        };

        ///////////////

        function link(scope, element, attrs, controller) {
            if(!scope.fieldFinder)
                scope.fieldFinder = controller;
            scope.offset = controller.offset = $document.findAll(attrs['selector']).height();

        }
    }
})();
