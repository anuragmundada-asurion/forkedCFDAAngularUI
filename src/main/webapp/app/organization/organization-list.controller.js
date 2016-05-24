(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationListController', ['$scope', '$timeout', 'appConstants', 'FederalHierarchyService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'filterFilter', '$compile',
        function ($scope, $timeout, appConstants, FederalHierarchyService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, filterFilter, $compile) {

            //Load data from FH
            //------------------------------------------------------------------

            getDataFromFh();
            function getDataFromFh() {
                //call on fh to get list of obj, formatted properly and in an array
                FederalHierarchyService.dtFormattedData(function (results) {
                    $scope.dtData_topLevel = results.topLevelData;
                    $scope.dtData_total = results.totalData;
                    $scope.childrenMap = results.childrenMappingData;
                    $scope.dtData = results.topLevelData; //current data to show in dt
                });
            }

            $scope.searchKeyword = '';


            function getChildrenMarkup(parentRowId, uniqueParentRowId) {
                var children = $scope.childrenMap[parentRowId];
                //var parentRowObj = $
                var childrenMarkup = '';
                var colors = ['#e5e5e5', '#cccccc']; //0 based, so must minus one from level, levels 1, 2, -> 0, 1
                var padding = ['40px', '80px'];

                angular.forEach(children, function (child, index, array) {
                    var childId = child.DT_RowId;
                    var childName = child.organization.name;
                    var level = child.hierarchyLevel;
                    var downArrow = '';
                    var action = '<td style="background-color: ' + colors[level - 1] + '; padding-left:' + padding[level - 1] + ';"><a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_EDIT_ORGANIZATION_CONFIG]}}" href="/organization/' + childId + '/edit"><span class="fa fa-pencil"></span></a><a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/' + childId + '/view"><span class="fa fa-file-text-o"></span></a>';
                    if (child.action.hasChildren) {
                        downArrow = '<a class="ui mini primary button"><span class="fa fa-chevron-circle-down"></span></a>';
                        action = action + downArrow + '</td>';
                    } else {
                        action = action + '</td>';
                    }
                    var title = '<td style="background-color: ' + colors[level - 1] + '; padding-left:' + padding[level - 1] + ';"><a has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/' + child.organization.organizationId + '/view">' + childName + '</a></td>';
                    var row = '<tr ng-click="rowClicked(\'' + childId + '\')" class="' + uniqueParentRowId + '-child" id="' + childId + '" role="row" class="odd">' + action + title + '</tr>';

                    childrenMarkup = childrenMarkup + row;

                });
                return $compile(childrenMarkup)($scope);
            }


            //Watches
            //------------------------------------------------------------------
            $scope.$watch('searchKeyword', function () {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtData = filterFilter($scope.dtData_total, $scope.searchKeyword);
                    $scope.dtInstance.DataTable.ajax.reload();
                }
                //if search is empty, then show only top level data
                if ($scope.dtInstance.DataTable && $scope.searchKeyword == '') {
                    $scope.dtData = $scope.dtData_topLevel;
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            }, true);

            $scope.$watch('dtData', function () {
                if ($scope.dtData) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            });


            // Datatables stuff
            //------------------------------------------------------------------
            $scope.loadOrganizations = function (data, callback, settings) {
                if ($scope.dtData) {
                    callback({
                        "draw": parseInt(data['draw']) + 1,
                        "recordsTotal": $scope.dtData.length,
                        "recordsFiltered": $scope.dtData.length,
                        "data": $scope.dtData
                    });
                } else {
                    //console.log("data not available yet??");
                }

            };

            $scope.rowClicked = function (uniqueRowId) {
                //uniqueRowId contains strings like "search-39202332" "search-child-193013013"
                var a = String(uniqueRowId).split("-");
                var rowId = a[a.length - 1];
                //toggle children
                var childRowMarkupClass = "." + uniqueRowId + "-child";
                if ($(childRowMarkupClass).length) {
                    $(childRowMarkupClass).toggle(500);
                } else {
                    var childrenMarkup = getChildrenMarkup(rowId, uniqueRowId);
                    $(childrenMarkup).insertAfter('#' + uniqueRowId); //insert after original row id
                }
            };

            angular.element('table').on('draw.dt', function () {
                // Initialize semantic ui dropdown
                //$(".dataTables_length select").addClass("ui compact dropdown").dropdown();
                // Remove select to fix dropdown  double click bug
                //$(".dataTables_length select").remove();
                $compile(angular.element('.dataTables_length'))($scope);
                $(".dataTables_info").appendTo(".dataTables_length label");
                $(".dataTables_info").contents().unwrap();
            });

            $scope.dtInstance = {};

            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withOption('sWidth', '200px')
            ];
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('order', [[1, 'asc']])
                .withOption('searching', false)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDataProp('data')
                .withDOM('<"usa-grid"r> <"usa-grid"t> <"usa-background-gray-lightest" <"usa-grid" <"usa-width-one-half"li> <"usa-width-one-half"p> > > <"clear">')
                .withOption('ajax', $scope.loadOrganizations)
                .withOption('bSortClasses', false)
                .withOption('rowCallback', function (row) {
                    $(row).click(function () {
                        $scope.rowClicked(this.id);
                    });
                    $compile(row)($scope);
                })
                .withLanguage({
                    'processing': '<div class="ui active small inline loader"></div> Loading',
                    'emptyTable': 'No Agencies Found',
                    'lengthMenu': 'Showing _MENU_ entries',
                    'info': ' of _TOTAL_ entries'
                });
            $scope.dtColumns = [

                DTColumnBuilder.newColumn('action')
                    .withTitle('Action')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        var htmlStr = '<a class="usa-button usa-button-compact" has-access="{{[PERMISSIONS.CAN_EDIT_ORGANIZATION_CONFIG]}}" href="/organization/' + data['organizationId'] + '/edit">' +
                            '<span class="fa fa-pencil"></span></a>' +
                            '<a class="usa-button usa-button-compact" has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/' + data['organizationId'] + '/view">' +
                            '<span class="fa fa-file-text-o"></span></a>';
                        if (data.hasChildren) {
                            htmlStr = htmlStr + '<a class="usa-button usa-button-compact"><span class="fa fa-chevron-circle-down"></span></a>';
                        }
                        return htmlStr;
                    })

                    .withOption('orderable', false),

                DTColumnBuilder.newColumn('organization')
                    .withTitle('Name')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        return '<a has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/' + data['organizationId'] + '/view">' + data['name'] + '</a>';
                    })
            ];
        }]);

})();
