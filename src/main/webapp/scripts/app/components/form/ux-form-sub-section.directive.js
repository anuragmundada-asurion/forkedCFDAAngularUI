(function() {
    "use strict";

    var FORM_SECTION_CTRL_INDEX = 0,
        FORM_SUB_SECTION_CTRL_INDEX = 1;


    angular
        .module('app')
        .directive('uxFormSubSection', UxFormSubSectionDirective);

    //////////////////

    function UxFormSubSectionDirective() {

        UxFormSubSectionController.$inject = [];

        return {
            restrict: 'AE',
            require: ['^^uxFormSection', 'uxFormSubSection'],
            controller: UxFormSubSectionController,
            controllerAs: 'uxSubSectionForm',
            scope: true,
            compile: compile
        };

        ///////////////////////

        function UxFormSubSectionController() {
            var self = this;
        }

        function compile(element, attr) {
            if(angular.isUndefined(attr.uxFormBookmark))
                attr.uxFormBookmark = "";
            return postLink;
        }

        function postLink(scope, element, attrs, ctrls) {
            var formSectionCtrl = ctrls[FORM_SECTION_CTRL_INDEX],
                formSubSectionCtrl = ctrls[FORM_SUB_SECTION_CTRL_INDEX];

            formSectionCtrl.addSection(formSubSectionCtrl);

            formSubSectionCtrl.uxFormSection = formSectionCtrl;
        }
    }
})();