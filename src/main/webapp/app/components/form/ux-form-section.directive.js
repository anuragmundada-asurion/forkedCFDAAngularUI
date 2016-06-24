(function() {
    "use strict";

    var FORM_CTRL_INDEX = 0,
        FORM_SECTION_CTRL_INDEX = 1;

    angular
        .module('app')
        .directive('uxFormSection', UxFormSectionDirective);

    //////////////////

    function UxFormSectionDirective() {

        UxFormSectionController.$inject = ['$document'];

        return {
            restrict: 'AE',
            require: ['^^uxForm', 'uxFormSection'],
            controller: UxFormSectionController,
            controllerAs: 'uxSectionForm',
            scope: true,
            compile: compile
        };

        ///////////////////////

        function UxFormSectionController($document) {
            var self = this,
                _subSections = [];

            angular.extend(self, {
                go: go,
                addSubSection: addSubSection
            });

            Object.defineProperties(self, {
                'subSections': {
                    enumerable: true,
                    get: getSubSections
                }
            });

            //////////////////

            function addSubSection(subSection) {
                _subSections.push(subSection);

                subSection.uxFormSection = self;
            }

            function getSubSections() {
                return _subSections.slice();
            }

            function go() {
                self.uxForm.current = self;
                self.uxForm.removeAllHighlights();
                $document.scrollToElementAnimated($document.findAll(self.uxForm.scrollAnchor), 188);
                window.location.hash=self.uxForm.scrollAnchor;//changes focus point for screen readers too
            }
        }

        function compile(element, attrs) {
            var wrapper = angular.element("<div class='usa-grid' ng-show='uxForm.current.stateKey === uxSectionForm.stateKey'></div>");
            wrapper.append(element.children());
            element.append(wrapper);
            return postLink;
        }

        function postLink(scope, element, attrs, ctrls) {
            var formCtrl = ctrls[FORM_CTRL_INDEX],
                formSectionCtrl = ctrls[FORM_SECTION_CTRL_INDEX];
            formSectionCtrl.stateKey = attrs.stateKey;
            formSectionCtrl.sectionTitle = attrs.sectionTitle;

            formCtrl.addSection(formSectionCtrl);
        }
    }
})();