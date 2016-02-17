(function() {
    "use strict";

    angular
        .module('app')
        .directive('multiEntrySelect', multiEntrySelectDirective);

    /////////////////

    function multiEntrySelectDirective() {
        return {
            restrict: 'E',
            controller: function() {},
            controllerAs: '_multiEntrySelect',
            require: ['^multiEntry', 'multiEntrySelect'],
            scope: true,
            compile: compile
        };

        ///////////////////

        function compile(element, attr) {
            var contents = element.contents();
            var html = '' +
                '<div ng-if="_multiEntrySelect.current.length >= 0" class="sub-form">' +
                    '<ux-content></ux-content>' +
                    '<button type="button" ng-click="_multiEntrySelect.save()">Save</button>' +
                    '<button type="button" ng-click="_multiEntrySelect.cancel()">Cancel</button>' +
                '</div>';

            element.append(html);

            element.find('ux-content').append(contents);

            return postLink;
        }

        function postLink(scope, element, attrs, ctrls) {
            var multiEntryCtrl = ctrls[0],
                multiEntrySelect = ctrls[1];

            multiEntryCtrl.initOpenAddEntryDialog(add);

            multiEntrySelect.save = save;
            multiEntrySelect.cancel = clearCurrent;

            ///////////////////

            function add() {
                var value = multiEntryCtrl.model.$modelValue || [];
                multiEntrySelect.current = value.slice();
                multiEntryCtrl.showList = false;
            }
            function save() {
                multiEntryCtrl.model.$setViewValue(multiEntrySelect.current);
                multiEntryCtrl.model.$render();
                clearCurrent();
            }

            function clearCurrent() {
                multiEntrySelect.current = null;
                multiEntryCtrl.closeEntryDialog();
                multiEntryCtrl.showList = true;
            }
        }
    }

})();