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
            template: function(element, attrs){
              var html = '<div class="usa-width-one-half">' +
                              '<label class="usa-sr-only">Field Finder Dropdown</label>' +
                              '<select ng-model="uxForm.selectedBookmark" ng-options="bookmark.text for bookmark in uxForm.bookmarks">' +
                                  '<option value="" disabled style="display:none">Select a field</option>' +
                              '</select>' +
                          '</div>' +
                          '<div class="usa-width-one-half">' +
                              '<button type="button" class="usa-button-big usa-button-fluid usa-margin-input" ng-click="uxForm.goToBookmark()">Jump to field</button>' +
                          '</div>';

              if(attrs.compact){
                html = '<div class="usa-grid-full">' +
                          '<div class="usa-width-two-thirds">' +
                            '<label class="usa-sr-only">Field Finder Dropdown</label>' +
                            '<select style="padding: 0.3em 2em 0.3em 0.7em; margin-top: 10px; position: relative;" ng-model="uxForm.selectedBookmark" ng-options="bookmark.text for bookmark in uxForm.bookmarks">' +
                                '<option value="" disabled style="display:none">Select a field</option>' +
                            '</select>' +
                          '</div>' +
                          '<div class="usa-width-one-third">' +
                            '<button type="button" class="" ng-click="uxForm.goToBookmark()">Jump</button>' +
                          '</div>' +
                        '</div>';
              }

              return html;
            }

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
