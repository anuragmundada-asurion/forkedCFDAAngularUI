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

            element.html(html);

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
                multiEntrySelect.current = [];
            }

            function save() {
                var list = multiEntryCtrl.model.$modelValue || [];

                angular.forEach(multiEntrySelect.current, function(choice){
                    if(list.indexOf(choice) < 0)
                        list.push(choice);
                });

                multiEntryCtrl.model.$setViewValue(list);
                multiEntryCtrl.model.$render();
                clearCurrent();
            }

            function clearCurrent() {
                multiEntrySelect.current = null;
                multiEntryCtrl.closeEntryDialog();
            }
        }
    }

})();