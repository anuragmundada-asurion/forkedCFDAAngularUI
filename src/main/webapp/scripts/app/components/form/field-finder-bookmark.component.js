(function() {
    "use strict";

    var hightlightClass = 'highlight';

    angular
        .module('app')
        .directive('fieldFinderBookmark', fieldFinderBookmark)

    fieldFinderBookmark.$inject = ['$document', 'util'];

    //////////////////

    function fieldFinderBookmark($document, util) {
        return {
            restrict: 'AE',
            require: ['^uxForm', '^uxFormSection'],
            link: link,
            scope: {
                text: '@fieldFinderBookmark',
                isDisabled: '='
            }
        };

        ///////////////

        function link(scope, element, attrs, controllers) {
            var uxForm = controllers[0],
                uxSection = controllers[1],
                text = scope.text || element.attr('title') || angular.element(element.findAll('h1, h2, h3, h4, label')[0]).text(),
                id = element.attr('id');

            if (element.attr('data-bookmark-parent')) {
                element = element.parent();
                element.attr("field-finder-bookmark", true);
            }

            if(!id) {
                id = "field-finder-bookmark-" + util.nextId();
                element.attr('id', id);
            }

            uxForm.addBookmark({
                text: text,
                id: id,
                goToElement: goToElement,
                removeHighlight: removeHighlight,
                isDisabled: scope.isDisabled,
                section : uxSection
            });

            ////////////////////

            function goToElement(offset) {
                $document.scrollToElementAnimated(element, offset);
                var input = element.findAll('input, select, button, a');
                input.focus();
                highlightSection();
            }
            function highlightSection() {
                element.addClass(hightlightClass);
            }

            function removeHighlight() {
                element.removeClass(hightlightClass);
            }
        }
    }
})();