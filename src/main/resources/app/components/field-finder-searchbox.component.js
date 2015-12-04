(function() {
    "use strict";

    angular
        .module('app')
        .directive('fieldFinderSearchbox', fieldFinderSearchbox);

    fieldFinderSearchbox.$inject = [];

    //////////////////

    function fieldFinderSearchbox() {
        return {
            restrict: 'E',
            require: '^fieldFinderForm',
            scope: false,
            template: '<select ng-model="fieldFinder.selected" ng-options="bookmark.text for bookmark in fieldFinder.bookmarks" ng-click="fieldFinder.selected.removeHighlight()" ng-keypress="fieldFinder.selected.removeHighlight()"><option value="" disabled style="display:none">Select a field</option></select><button type="button" class="usa-button-big" ng-click="fieldFinder.go()">Go</button>'
        };
    }
})();