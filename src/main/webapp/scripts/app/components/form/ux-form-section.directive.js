(function() {
    "use strict";

    var FORM_CTRL_INDEX = 0,
        FORM_SECTION_CTRL_INDEX = 1;

    angular
        .module('app')
        .directive('uxFormSection', UxFormSectionDirective);

    //////////////////

    function UxFormSectionDirective() {

        UxFormSectionController.$inject = [];

        return {
            restrict: 'AE',
            require: ['^^uxForm', 'uxFormSection'],
            controller: UxFormSectionController,
            controllerAs: 'uxSectionForm',
            scope: true,
            compile: compile
        };

        ///////////////////////

        function UxFormSectionController() {
            var self = this,
                subSections = [];

            /*angular.extend(self, {
                addSubSection: addSubSection
            });*/

            //////////////////

            /*function addSubSection(subSection) {
                subSections.push(subSection);
            }*/
        }

        function compile(element, attrs) {
            var wrapper = angular.element("<div ng-show='uxForm.current.stateKey === uxSectionForm.stateKey'></div>");
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