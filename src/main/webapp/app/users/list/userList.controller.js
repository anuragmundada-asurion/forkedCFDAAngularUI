!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserListCtrl', ['$scope', 'ApiService', 'FederalHierarchyService', 'DTColumnBuilder', 'DTOptionsBuilder', '$q',
        function($scope, ApiService, FederalHierarchyService, DTColumnBuilder, DTOptionsBuilder, $q) {
            $scope.searchFirstName = '';
            $scope.searchLastName = '';
            $scope.dtInstance = {};

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('infoCallback', function(settings, start, end, max, total, pre) {
                    $scope.totalCount = total;
                })
                .withOption('initComplete', function(){
                    // Initialize semantic ui dropdown
                    $(".dataTables_length select").addClass("ui compact dropdown").dropdown();
                    // Remove select to fix dropdown  double click bug
                    $(".dataTables_length select").remove();
                    // Append info text for easier theming
                    $(".dataTables_info").appendTo(".dataTables_length label");
                    $(".dataTables_info").contents().unwrap();
                })
                .withOption('processing', true)
                .withOption('ajax', function(data, callback, settings) {
                    var oApiParam = {
                        apiName: 'userList',
                        apiSuffix: '',
                        oParams: {},
                        oData: {},
                        method: 'GET'
                    };

                    if ($scope.searchFirstName || $scope.searchLastName) {
                    }

                    ApiService.call(oApiParam).then(
                        function (results) {
                            var promises = [];
                            var tableData = [];
                            angular.forEach(results, function (r) {
                                r['name'] = r['firstName'] + ' ' + r['lastName'];
                                if (r['orgID']) {
                                    promises.push(FederalHierarchyService.getFederalHierarchyById(r['orgID'], true, false, function (data) {
                                        r['organization'] = FederalHierarchyService.getFullNameFederalHierarchy(data);
                                    }, function () {
                                        r['organization'] = 'Organization Not Found';
                                    }));
                                } else {
                                    r['organization'] = 'No Organization Assigned';
                                }
                                tableData.push(r);
                            });
                            $q.all(promises).then(function () {
                                callback(tableData);
                            });
                        }
                    );
                })
                .withOption('searching', false)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDOM('<"top ui fixed container"r> <"ui fixed container"t> <"bottom background gray" <"ui fixed container" <"ui grid" <"two column row" <"column"li> <"column"p> > > > > <"clear">')
                .withLanguage({
                    'processing': '<div class="ui active small inline loader"></div> Loading',
                    'emptyTable': 'No Users Found',
                    'lengthMenu': 'Showing _MENU_ entries',
                    'info': ' of _TOTAL_ entries'
                });
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('action')
                    .withTitle('Action')
                    .withOption('defaultContent', '')
                    .withOption('orderable', false),
                DTColumnBuilder.newColumn('name').withTitle('Name').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('organization').withTitle('Department/Sub-Tier Agency & Office').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('assignedAgencies').withTitle('Assigned Agencies').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('email').withTitle('E-mail').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('workPhone').withTitle('Phone').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('gsaRAC[, ]').withTitle('Roles').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('permissions').withTitle('Permissions').withOption('defaultContent', '')
            ];
        }
    ]);
}();