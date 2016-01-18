(function() {
    "use strict";

    var hightlightClass = 'highlight';

    angular
        .module('app')
        .directive('fieldFinderBookmark', fieldFinderBookmark)
        .directive('fieldFinderSection', fieldFinderSection);

    fieldFinderBookmark.$inject = ['$document', 'util'];

    //////////////////

    function fieldFinderBookmark($document, util) {
        return {
            restrict: 'AE',
            require: ['^fieldFinderForm', '?^^fieldFinderSection'],
            link: link,
            scope: {
                text: '@fieldFinderBookmark',
                isDisabled: '='
            }
        };

        ///////////////

        function link(scope, element, attrs, controllers) {
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

    function fieldFinderSection() {
        fieldFinderSectionController.$inject = [];

        var controllerAs = 'fieldFinderSection';

        return {
            restrict: 'AE',
            require: '?^^wizard',
            controller: fieldFinderSectionController,
            controllerAs: controllerAs,
            bindToController: true,
            link: link,
            scope: false
        };

        ///////////////

        function fieldFinderSectionController() {
            var vm = this;

            vm.goToSection = goToSection;
            vm.isCurrentSection = isCurrentSection;

            ///////////////////

            function goToSection() {
                vm.wizard.goTo(vm.sectionTitle);
            }

            function isCurrentSection() {
                return vm.wizard.currentStepTitle() === vm.sectionTitle;
            }
        }

        function link(scope, element, attrs, controller) {
            scope[controllerAs].wizard = controller;
            scope[controllerAs].sectionTitle = attrs['title'];
        }
    }

})();