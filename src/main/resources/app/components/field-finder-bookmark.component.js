(function() {
    "use strict"

    var hightlightClass = 'highlight';

    angular
        .module('app')
        .directive('fieldFinderBookmark', fieldFinderBookmark);

    fieldFinderBookmark.$inject = ['$document'];

    //////////////////

    function fieldFinderBookmark($document) {
        return {
            restrict: 'AE',
            require: '^fieldFinderForm',
            link: link,
            scope: {
                text: '@fieldFinderForm',
                isDisabled: '='
            }
        };

        ///////////////

        function link(scope, element, attrs, controller) {
            var text = scope.text || element.attr('title') || angular.element(element.find('label')[0]).text();

            controller.addBookmark({
                text: text,
                goToElement: goToElement,
                removeHighlight: removeHighlight,
                isDisabled: scope.isDisabled
            })

            ////////////////////

            function goToElement() {
                $document.scrollToElementAnimated(element);
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