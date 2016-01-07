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
            priority: 1,
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
                listFilter: "=",
                onAfterDialogOpen: "="
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
                var listElement = angular.element("<multi-entry-list></multi-entry-list>"),
                    filterFunc;
                listElement.attr('editable', scope.editableItems);
                listElement.attr('listTrackBy', scope.listTrackBy);
                var filterExp = filterFunc = scope.listFilter;
                if(angular.isFunction(filterFunc)) {
                    ctrl.listFilter = filterFunc;
                    filterExp = "filter:$ctrl.listFilter";
                }
                listElement.attr('listFilter', filterExp);
                element.find('multi-entry-header').after(listElement);
                $compile(listElement)(scope);
            }

            scope.$ctrl.formatTitle = function(item) {
                var strFormatter = scope.itemTitle;
                return angular.isString(strFormatter) ? $parse(strFormatter)(item) : strFormatter(item);
            };
            scope.$ctrl.onDelete = scope.onEntryDelete || angular.noop;

            if(scope.onAfterDialogOpen)
                ctrl.initAfterDialogOpen(scope.onAfterDialogOpen);
            scope.$watchCollection(function(){ return model.$modelValue; }, function(newValue, oldValue) {
                if (oldValue !== newValue) {
                    model.$modelValue = null;
                }
            });
        }

        function multiEntryController() {
            var ctrl = this,
                onOpenAddEntryDialog = angular.noop,
                onOpenEditEntryDialog = angular.noop,
                onAfterDialogOpen = angular.noop;

            ctrl.locals = {};

            ctrl.deleteEntry = deleteEntry;
            ctrl.allowModifications = true;
            ctrl.openEntryDialog = openEntryDialog;
            ctrl.closeEntryDialog = closeEntryDialog;
            ctrl.initOpenAddEntryDialog = initOpenAddEntryDialog;
            ctrl.initOpenEditEntryDialog = initOpenEditEntryDialog;
            ctrl.initAfterDialogOpen = initAfterDialogOpen;

            ////////////

            function deleteEntry(item) {
                if (ctrl.allowModifications) {
                    var list = ctrl.model.$modelValue,
                        index = list.indexOf(item);
                    list.splice(index, 1);
                    ctrl.onDelete({ removed: item });
                }
            }

            function openEntryDialog(item) {
                if (ctrl.allowModifications) {
                    ctrl.allowModifications = false;
                    if (!item)
                        onOpenAddEntryDialog();
                    else
                        onOpenEditEntryDialog(item);
                    onAfterDialogOpen(item, ctrl.locals);
                }
            }

            function closeEntryDialog() {
                ctrl.allowModifications = true;
            }

            function initOpenAddEntryDialog(func) {
                if (onOpenAddEntryDialog  === angular.noop)
                    onOpenAddEntryDialog = func;
            }

            function initOpenEditEntryDialog(func) {
                if (onOpenEditEntryDialog === angular.noop)
                    onOpenEditEntryDialog = func;
            }

            function initAfterDialogOpen(func) {
                if (onAfterDialogOpen === angular.noop)
                    onAfterDialogOpen = func;
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