!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserListCtrl', ['$scope', 'ApiService', 'FederalHierarchyService', 'DTColumnBuilder', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        function($scope, ApiService, FederalHierarchyService, DTColumnBuilder, DTOptionsBuilder, DTColumnDefBuilder) {
            $scope.searchFirstName = '';
            $scope.searchLastName = '';
            $scope.dtInstance = {};

            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                    var oApiParam = {
                        apiName: 'userList',
                        apiSuffix: '',
                        oParams: {},
                        oData: {},
                        method: 'GET'
                    };

                    if ($scope.searchFirstName || $scope.searchLastName) {
                    }

                    return ApiService.call(oApiParam);
                })
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
                DTColumnBuilder.newColumn('lastName').withTitle('Last Name').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('firstName').withTitle('First Name').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('organization').withTitle('Department/Sub-Tier Agency & Office').withOption('defaultContent', ''),
                //DTColumnBuilder.newColumn('assignedAgencies').withTitle('Assigned Agencies').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('email').withTitle('E-mail').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('phone').withTitle('Phone').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('_id').withTitle('Username').withOption('defaultContent', ''),
                //DTColumnBuilder.newColumn('permissions').withTitle('Permission Attributes').withOption('defaultContent', ''),
                //DTColumnBuilder.newColumn('lastLogin').withTitle('Last Login').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('gsaRAC[, ]').withTitle('Roles').withOption('defaultContent', ''),
                //DTColumnBuilder.newColumn('accountStatus').withTitle('Account Status').withOption('defaultContent', '')
            ];
        }
    ]);
}();