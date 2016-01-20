(function() {
    "use strict";

    var hightlightClass = 'highlight';

    angular
        .module('app')
        .directive('uxFormBookmark', UxFormBookmarkDirective);

    UxFormBookmarkDirective.$inject = ['$document', 'util'];

    //////////////////

    function UxFormBookmarkDirective($document, util) {
        return {
            restrict: 'AE',
            require: ['^fieldFinderForm', '?^^fieldFinderSection'],
            link: postLink,
            scope: {
                text: '@fieldFinderBookmark',
                isDisabled: '='
            }
        };

        ///////////////

        function postLink(scope, element, attrs, controllers) {
            var fieldFinderForm = controllers[0],
                fieldFinderSection = controllers[1],
                text = scope.text || element.attr('title') || angular.element(element.findAll('h1, h2, h3, h4, label')[0]).text(),
                id = element.attr('id');

            if(!id) {
                id = "field-finder-bookmark-" + util.nextId();
                element.attr('id', id);
            }
            fieldFinderForm.addBookmark({
                text: text,
                id: id,
                goToElement: goToElement,
                removeHighlight: removeHighlight,
                isDisabled: scope.isDisabled,
                section : fieldFinderSection
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