(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationListController', ['$scope', '$log', '$timeout', '$http', 'appConstants', 'ApiService', 'Dictionary', 'FederalHierarchyService', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$q',
        function ($scope, $log, $timeout, $http, appConstants, ApiService, Dictionary, FederalHierarchyService, UserService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $q) {


            console.log("hello from orglist controller");

            //make params, call api service, which will call proxy backend, which will get the data,
            //once you get the data, print it out


            $scope.loadAgencies = function (data, callback, settings) {

                var oApiParam = {
                    apiName: 'federalHierarchyConfiguration',
                    apiSuffix: '',
                    oParams: {
                        limit: 50,
                        offset: 0,
                        includeCount: true
                    },
                    method: 'GET'
                };

                ApiService.call(oApiParam).then(
                    function (d) {
                        var results = d.results;
                        var tableData = [];
                        var promises = [];
                        angular.forEach(results, function (r) {
                            var row = {
                                'agency': {
                                    'organizationId': r['organizationId']
                                },
                                'programNumberAuto': r['programNumberAuto'],
                                'programNumberHigh': r['programNumberHigh'],
                                'programNumberLow': r['programNumberLow'],
                                'action': {
                                    'organizationId': r['organizationId']
                                }
                            };
                            //make call to fh to get name
                            promises.push(FederalHierarchyService.getFederalHierarchyById(r['organizationId'], false, false, function (data) {

                                row['agency']['name'] = data.name;
                            }, function () {
                                row['agency']['name'] = 'Organization Not Found';
                            }));


                            tableData.push(row);
                        });


                        $q.all(promises).then(function () {
                            console.log('orgList -- about to call callback, d:', d);
                            console.log('orgList -- about to call callback, data:', data);
                            console.log('orgList -- about to call callback, tableData:', tableData);
                            callback({
                                "draw": parseInt(data['draw']) + 1,
                                "recordsTotal": d['totalCount'],
                                "recordsFiltered": d['totalCount'],
                                "data": tableData
                            });


                        });
                    }
                );
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
                        var htmlStr = '<a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE]}}" href="/organization/' + data['organizationId'] + '/edit">' +
                            '<span class="fa fa-pencil"></span></a>' +
                            '<a class="ui mini primary button" has-access="{{[PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE]}}" href="/organization/' + data['organizationId'] + '/view">' +
                            '<span class="fa fa-file-text-o"></span></a>';
                        return htmlStr;
                    })
                    .withOption('orderable', false),

                DTColumnBuilder.newColumn('agency')
                    .withTitle('Name')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        return '<a has-access="{{[PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE]}}" href="/organization/' + data['organizationId'] + '/view">' + data['name'] + '</a>';
                    })
            ];
        }]);

})();
