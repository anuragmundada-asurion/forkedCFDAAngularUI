(function() {
    "use strict";

    angular
        .module('app')
        .directive('multiEntrySubForm', multiEntryFormDirective);

    multiEntryFormDirective.$inject = ['util'];

    /////////////////

    function multiEntryFormDirective(util) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl:'partials/components/multi-entry-sub-form.tpl.html',
            require: '^multiEntry',
            scope: {
                createFunction: "="
            },
            compile: compile
        };

        function compile(element) {
            element.find('ng-form').attr('name', 'sub-form-' + util.nextId());

            return link;
        }

        ///////////////////

        function link(scope, element, attrs, multiEntryCtrl) {
            scope.save = save;
            scope.cancel = clearCurrent;

            scope.$ctrl = scope.$ctrl || multiEntryCtrl;

            multiEntryCtrl.initOpenAddEntryDialog(add);
            multiEntryCtrl.initOpenEditEntryDialog(edit);

            ///////////////////

            function add() {
                scope.current = scope.createFunction ? scope.createFunction() : {};
            }

            function edit(item) {
                var copy = angular.copy(item);
                copy.$original = item;
                scope.current = copy;
            }

            function save() {
                var list = multiEntryCtrl.model.$modelValue,
                    original = scope.current.$original;
                delete scope.current.$original;
                if (original) {
                    var index = list.indexOf(original);
                    list[index] = scope.current;
                } else
                    list.push(scope.current);
                clearCurrent();
            }

            function clearCurrent() {
                scope.current = null;
                multiEntryCtrl.closeEntryDialog();
            }
        }
    }

})();