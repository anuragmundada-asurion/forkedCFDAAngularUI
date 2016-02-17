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
            require: '^uxForm',
            link: link,
            template:
            '<div class="usa-width-one-half">' +
                '<label class="sr-only">Field Finder Dropdown</label>' +
                '<select ng-model="uxForm.selectedBookmark" ng-options="bookmark.text for bookmark in uxForm.bookmarks">' +
                    '<option value="" disabled style="display:none">Select a field</option>' +
                '</select>' +
            '</div>' +
            '<div class="usa-width-one-half">' +
                '<button type="button" class="usa-button-big" ng-click="uxForm.goToBookmark()">Jump to field</button>' +
            '</div>'
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