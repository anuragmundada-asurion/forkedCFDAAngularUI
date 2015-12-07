(function() {
    "use strict";

    angular
        .module('app')
        .directive('fieldFinderSearchbox', fieldFinderSearchbox);

    fieldFinderSearchbox.$inject = ['util'];

    //////////////////

    function fieldFinderSearchbox(util) {
        return {
            restrict: 'E',
            require: '^fieldFinderForm',
            scope: false,
            link: link,
            template: '<label class="sr-only">Field Finder Dropdown</label><select ng-model="fieldFinder.selected" ng-options="bookmark.text for bookmark in fieldFinder.bookmarks" ng-click="fieldFinder.selected.removeHighlight()" ng-keypress="fieldFinder.selected.removeHighlight()"><option value="" disabled style="display:none">Select a field</option></select><button type="button" class="usa-button-big" ng-click="fieldFinder.go()">Go</button>'
        };

        ///////////////////

        function link(scope, element) {
            var $select = element.find('select'),
                $label = element.find('label'),
                id = 'fieldFinder_' + util.nextId();

            $select.attr('id', id);
            $label.attr('for', id);
        }
    }
})();