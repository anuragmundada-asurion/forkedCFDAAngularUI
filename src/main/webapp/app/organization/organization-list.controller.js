(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationListController', ['$scope', '$timeout', 'appConstants', 'FederalHierarchyService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'filterFilter', '$compile',
        function ($scope, $timeout, appConstants, FederalHierarchyService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, filterFilter, $compile) {


            var dataMap = {
                topLevel: {},

                '100011942': [
                    {
                        action: {
                            organizationId: "100012855"
                        },
                        organization: {
                            hasParent: true,
                            name: "U.S. COAST GUARD",
                            organizationId: "100012855",
                            parentId: "100011942"
                        }
                    },
                    {
                        action: {
                            organizationId: "100011968"
                        },
                        organization: {
                            hasParent: true,
                            name: "U.S. CITIZENSHIP AND IMMIGRATION SERVICES",
                            organizationId: "100011968",
                            parentId: "100011942"
                        }
                    },
                    {
                        action: {
                            organizationId: "100012967"
                        },
                        organization: {
                            hasParent: true,
                            name: "U.S. SECRET SERVICE",
                            organizationId: "100012967",
                            parentId: "100011942"
                        }
                    }

                ]


            };


            $scope.data = {};
            //Load data from FH
            //------------------------------------------------------------------
            $scope.dtData; //result of search filter will go into here also
            $scope.dtData_original; // remains same
            getDataFromFh();

            function getDataFromFh() {
                //call on fh to get list of obj, formatted properly and in an array
                FederalHierarchyService.dtFormattedData(function (tableData) {
                    console.log('tableData: ', tableData);
                    $scope.dtData = tableData;
                    $scope.dtData_original = tableData;
                });
            }

            $scope.searchKeyword = '';


            //Watches
            //------------------------------------------------------------------

            $scope.$watch('searchKeyword', function () {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtData = filterFilter($scope.dtData_original, $scope.searchKeyword);
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            }, true);

            $scope.$watch('dtData', function () {
                if ($scope.dtData) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            });


            //datatables stuff
            //------------------------------------------------------------------

            $scope.loadOrganizations = function (data, callback, settings) {
                if ($scope.dtData) {
                    //console.log("data is available");
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

            $scope.rowClicked = function () {
                console.log("table was clicked");
                $('table tbody').off().on('click', 'tr', function () {
                    console.log("click handler");
                    var data = $scope.dtInstance.DataTable.row(this).data();
                    var rowId = $scope.dtInstance.DataTable.row(this).id();
                    console.log('You clicked on a row with this data: ', data);


                    //append children after this row.
                    var anchor = $('<a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_EDIT_ORGANIZATION_CONFIG]}}" href="/organization/100012855/edit"><span class="fa fa-pencil"></span></a><a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/100012855/view"><span class="fa fa-file-text-o"></span></a>');
                    var title = $('<a has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/100012855/view">U.S. COAST GUARD1</a>');
                    var row = $('<tr role="row" class="even"></tr>').append($('<td></td>').append(anchor)).append($('<td></td>').append(title));
                    $(row).insertAfter("#" + rowId);


                });
            };

            angular.element('table').on('draw.dt', function () {
                // Initialize semantic ui dropdown
                $(".dataTables_length select").addClass("ui compact dropdown").dropdown();
                // Remove select to fix dropdown  double click bug
                $(".dataTables_length select").remove();
                $compile(angular.element('.dataTables_length'))($scope);

                var anchor = $('<a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_EDIT_ORGANIZATION_CONFIG]}}" href="/organization/100012855/edit"><span class="fa fa-pencil"></span></a><a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/100012855/view"><span class="fa fa-file-text-o"></span></a>');
                var title = $('<a has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/100012855/view">U.S. COAST GUARD</a>');
                var row = $('<tr role="row" class="even"></tr>').append($('<td></td>').append(anchor)).append($('<td></td>').append(title));
                $("table tbody").append(row);
                $compile(row)($scope);
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
                .withDOM('<"top ui fixed container"r> <"ui fixed container"t> <"bottom background gray" <"ui fixed container" <"ui grid" <"two column row" <"column"li> <"column"p> > > > > <"clear">')
                .withOption('ajax', $scope.loadOrganizations)
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
                    .withOption('rowCallback', function (row) {
                        $compile(row)($scope);
                    })
                    .withOption('render', function (data) {
                        var htmlStr = '<a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_EDIT_ORGANIZATION_CONFIG]}}" href="/organization/' + data['organizationId'] + '/edit">' +
                            '<span class="fa fa-pencil"></span></a>' +
                            '<a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/' + data['organizationId'] + '/view">' +
                            '<span class="fa fa-file-text-o"></span></a>';
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

