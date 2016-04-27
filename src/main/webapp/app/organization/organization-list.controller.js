(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationListController', ['$scope', '$log', '$timeout', '$http', 'appConstants', 'ApiService', 'Dictionary', 'FederalHierarchyService', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$q', 'AuthorizationService', 'ROLES', 'filterFilter',
        function ($scope, $log, $timeout, $http, appConstants, ApiService, Dictionary, FederalHierarchyService, UserService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $q, AuthorizationService, ROLES, filterFilter) {

            //Load data from FH
            //------------------------------------------------------------------
            $scope.dtData; //result of search filter will go into here also
            $scope.dtData_original; // remains same
            getDataFromFh();

            function getDataFromFh() {

                var userOrgId = UserService.getUserOrgId();
                //no filter if rmo or super user
                if (AuthorizationService.authorizeByRole([ROLES.SUPER_USER, ROLES.RMO_SUPER_USER])) {
                    userOrgId = null;
                }

                //call on fh to get list of obj, formatted properly and in an array
                FederalHierarchyService.dtFormattedData(userOrgId, null, function (d) {
                    //console.log('got this data from fh', d);
                    var tableData = [];
                    var results = d;
                    //make row obj for datatables
                    angular.forEach(results, function (r) {
                        var row = {
                            'agency': {
                                'organizationId': r['elementId'],
                                'name': r['name'],
                                'hasParent': r['hasParent']
                            },
                            'action': {
                                'organizationId': r['elementId']
                            }
                        };
                        if (r['hasParent']) {
                            row.agency.parentId = r['parentId'];
                        }
                        tableData.push(row);
                    });

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

            $scope.loadAgencies = function (data, callback, settings) {
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

            $scope.dtInstance = {};

            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withOption('sWidth', '200px')
            ];
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('initComplete', function (settings, json) {
                    // Initialize semantic ui dropdown
                    $(".dataTables_length select").addClass("ui compact dropdown").dropdown();
                    // Remove select to fix dropdown  double click bug
                    $(".dataTables_length select").remove();
                    // Append info text for easier theming
                    $(".dataTables_info").appendTo(".dataTables_length label");
                    $(".dataTables_info").contents().unwrap();

                    //Faking levels

                    $("table tr:nth-child(3)").html("<td colspan='2' style='padding: 0;'><table style='width: 100%;'><tr><td><a class='ui mini primary button' ><span class='fa fa-pencil'></span></a><a class='ui mini primary button' href='/organization/3999999/view'><span class='fa fa-file-text-o'></span></a><a style='margin-left: 100px;'>General Services Administration</a></td></tr><tr><td style='background-color: #e5e5e5;'><a class='ui mini primary button' style='margin-left: 38px;' ><span class='fa fa-pencil'></span></a><a class='ui mini primary button' href='/organization/3999999/view'><span class='fa fa-file-text-o'></span></a><a style='margin-left: 100px;'>CFDA Test Office</a></td></tr><tr><td style='background-color: #cccccc;'><a class='ui mini primary button' style='margin-left:75px;' ><span class='fa fa-pencil'></span></a><a class='ui mini primary button' href='/organization/3999999/view'><span class='fa fa-file-text-o'></span></a><a style='margin-left: 100px;'>EDS Test Location</a></td></tr></table></td>");

                })
                .withOption('order', [[1, 'asc']])
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withOption('searching', false)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDataProp('data')
                .withDOM('<"top ui fixed container"r> <"ui fixed container"t> <"bottom background gray" <"ui fixed container" <"ui grid" <"two column row" <"column"li> <"column"p> > > > > <"clear">')
                .withOption('ajax', $scope.loadAgencies)
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


                        var htmlStr = '<a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_EDIT_ORGANIZATION_CONFIG]}}" href="/organization/' + data['organizationId'] + '/edit">' +
                            '<span class="fa fa-pencil"></span></a>' +
                            '<a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/' + data['organizationId'] + '/view">' +
                            '<span class="fa fa-file-text-o"></span></a>';
                        return htmlStr;
                    })

                    .withOption('orderable', false),

                DTColumnBuilder.newColumn('agency')
                    .withTitle('Name')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        return '<a has-access="{{[PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG]}}" href="/organization/' + data['organizationId'] + '/view">' + data['name'] + '</a>';
                    })
            ];
        }]);

})();

