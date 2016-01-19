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
            priority: 0,
            transclude: true,
            controller: multiEntryFormController,
            controllerAs: '$subForm',
            templateUrl:'partials/components/multi-entry-sub-form.tpl.html',
            require: ['^multiEntry', 'multiEntrySubForm'],
            scope: {
                createFunction: "=",
                onParentUpdate: "=",
                beforeSave: "=",
                onSave: "="
            },
            compile: compile
        };

        function compile(element) {
            element.find('ng-form').attr('name', 'sub-form-' + util.nextId());

            return link;
        }

        ///////////////////

        function multiEntryFormController() {
            var $subForm = this;

        }

        function link(scope, element, attrs, ctrls) {
            var multiEntryCtrl = ctrls[0],
                $subForm = ctrls[1],
                $currentParentPoint = scope.$parent,
                $parentSubForm;

            scope.$ctrl = scope.$ctrl || multiEntryCtrl;

            while($currentParentPoint && !$parentSubForm) {
                if($currentParentPoint.$subForm)
                    $parentSubForm = $currentParentPoint.$subForm;
                else
                    $currentParentPoint = $currentParentPoint.$parent;
            }
            if($parentSubForm) {
                scope.$parentSubForm = $parentSubForm;
                scope.$watch(function(){
                    return $parentSubForm.current;
                }, function(newVal){
                    scope.onParentUpdate(newVal, $subForm.current);
                }, true);
            }

            scope.$subForm = $subForm;

            scope.save = save;
            scope.cancel = clearCurrent;
            scope.change = change;

            multiEntryCtrl.initOpenAddEntryDialog(add);
            multiEntryCtrl.initOpenEditEntryDialog(edit);

            ///////////////////

            function change() {
                console.log("ng-change4 inside multi");
                console.log("agencyId = ");
                console.log("fullName = " + $subForm.current.fullName);
                var contactResult = $subForm.current.contactId.split(",x,");

                $subForm.current.title = contactResult[0];
                $subForm.current.fullName = contactResult[1];
                $subForm.current.email = contactResult[2];
                $subForm.current.phone = contactResult[3];
                $subForm.current.fax = contactResult[4];
                $subForm.current.address = contactResult[5];
                $subForm.current.city = contactResult[6];
                $subForm.current.state = contactResult[7];
                $subForm.current.zip = contactResult[8];
            }

            function add() {
                var parentItem = $parentSubForm ? $parentSubForm.current : undefined;
                $subForm.current = scope.createFunction ? scope.createFunction(parentItem) : {};
            }

            function edit(item) {
                var copy = angular.copy(item);
                copy.$original = item;
                $subForm.current = copy;
            }

            function save() {
                var list = multiEntryCtrl.model.$modelValue || [],
                    original = $subForm.current.$original,
                    parentItem = $parentSubForm ? $parentSubForm.current : undefined;
                (scope.beforeSave || angular.noop)($subForm.current, parentItem);

                delete $subForm.current.$original;
                if (original) {
                    var index = list.indexOf(original);
                    list[index] = $subForm.current;
                } else
                    list.push($subForm.current);
                multiEntryCtrl.model.$setViewValue(list);
                multiEntryCtrl.model.$render();
                (scope.onSave || angular.noop)($subForm.current, parentItem);
                clearCurrent();
            }

            function clearCurrent() {
                $subForm.current = null;
                multiEntryCtrl.closeEntryDialog();
            }
        }
    }

})();