(function() {
    "use strict";

    angular
        .module('app')
        .directive('multiEntry', multiEntryDirective)
        .directive('multiEntryHeader', multiEntryHeaderDirective)
        .directive('multiEntryList', multiEntryListDirective);

    multiEntryDirective.$inject = ['$parse', '$compile'];

    //////////////////

    function multiEntryDirective($parse, $compile) {
        return {
            restrict: 'E',
            controller: multiEntryController,
            controllerAs: '$ctrl',
            template: "<div transclude-append></div>",
            require: ['multiEntry', '^ngModel'],
            transclude: true,
            replace: false,
            scope: {
                itemTitle: "=",
                onEntryDelete: "&",
                editableItems: "@",
                newEntryBtnName: "@",
                deleteLabelName: "@",
                parentVm: "=",
                listTrackBy: "@",
                listFilter: "@"
            },
            link: link
        };

        ///////////////

        function link(scope, element, attrs, ctrls) {
            var ctrl = ctrls[0],
                model = ctrls[1];

            ctrl.model = model;
            scope.$watch(function() {
                return scope.parentVm;
            }, function(newVal){
                ctrl.parentVm = newVal;
            });
            if (element.find('multi-entry-list').length <= 0) {
                var listElement = angular.element("<multi-entry-list></multi-entry-list>");
                listElement.attr('editable', scope.editableItems);
                listElement.attr('listTrackBy', scope.listTrackBy);
                listElement.attr('listFilter', scope.listFilter);
                element.find('multi-entry-header').after(listElement);
                $compile(listElement)(scope);
            }

            scope.$watchCollection(function() {
                return model.$modelValue;
            }, function(newValue, oldValue) {
                if (oldValue !== newValue) {
                    model.$modelValue = null;
                }
            });

            scope.$ctrl.formatTitle = function(item) {
                var strFormatter = scope.itemTitle;
                return angular.isString(strFormatter) ? $parse(strFormatter)(item) : strFormatter(item);
            };
            scope.$ctrl.onDelete = scope.onEntryDelete || angular.noop;
        }

        function multiEntryController() {
            var ctrl = this,
                onOpenAddEntryDialog,
                onOpenEditEntryDialog;

            ctrl.deleteEntry = deleteEntry;
            ctrl.allowModifications = true;
            ctrl.openEntryDialog = openEntryDialog;
            ctrl.closeEntryDialog = closeEntryDialog;
            ctrl.initOpenAddEntryDialog = initOpenAddEntryDialog;
            ctrl.initOpenEditEntryDialog = initOpenEditEntryDialog;

            ////////////

            function deleteEntry($index) {
                if (ctrl.allowModifications) {
                    var removed = ctrl.model.$modelValue.splice($index, 1)[0];
                    ctrl.onDelete({ removed: removed });
                }
            }

            function openEntryDialog(item) {
                if (ctrl.allowModifications) {
                    ctrl.allowModifications = false;
                    if (!item)
                        onOpenAddEntryDialog();
                    else
                        onOpenEditEntryDialog(item);
                }
            }

            function closeEntryDialog() {
                ctrl.allowModifications = true;
            }

            function initOpenAddEntryDialog(func) {
                if (angular.isUndefined(onOpenAddEntryDialog))
                    onOpenAddEntryDialog = func;
            }

            function initOpenEditEntryDialog(func) {
                if (angular.isUndefined(onOpenEditEntryDialog))
                    onOpenEditEntryDialog = func;
            }
        }
    }

    function multiEntryListDirective() {
        var defaultTrackBy = "$index";

        return {
            restrict: 'E',
            templateUrl: function(element, attr) {
                return attr.editable === "true"
                    ? 'partials/components/multi-entry-list-editable.tpl.html'
                    : 'partials/components/multi-entry-list.tpl.html';
            },
            compile: compile
        };

        /////////////

        function compile(element, attr) {
            var listitem = element.find('li'),
                repeatExp = "item in $ctrl.model.$modelValue",
                trackBy = "track by " + (attr.listtrackby || defaultTrackBy);
            if(attr.listfilter)
                repeatExp += " | " + attr.listfilter;

            repeatExp += " " + trackBy;

            listitem.attr('ng-repeat', repeatExp);
        }
    }

    function multiEntryHeaderDirective() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl:'partials/components/multi-entry-header-section.tpl.html'
        };
    }
})();