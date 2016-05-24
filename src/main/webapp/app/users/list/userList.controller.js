!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserListCtrl', ['$scope', 'ApiService', 'FederalHierarchyService', 'DTColumnBuilder', 'DTOptionsBuilder', '$q',
        function($scope, ApiService, FederalHierarchyService, DTColumnBuilder, DTOptionsBuilder, $q) {
            $scope.searchKeyword = '';
            $scope.dtInstance = {};

            $scope.$watch('searchKeyword', function() {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.search($scope.searchKeyword).draw();
                }
            }, true);

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('infoCallback', function(settings, start, end, max, total, pre) {
                    $scope.totalCount = total;
                })
                .withOption('initComplete', function(){
                    $(".jqUsersContactInfo").popup({
                        on: 'click',
                        position: 'left center'
                    });
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

                    ApiService.call(oApiParam).then(
                        function (results) {
                            var promises = [];
                            var tableData = [];
                            angular.forEach(results, function (r) {
                                r['name'] = {
                                    'name': r['firstName'] + ' ' + r['lastName'],
                                    'email': r['email'],
                                    'phone': r['workPhone']
                                };
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
                .withOption('searching', true)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDOM('<"usa-grid"r> <"usa-grid"t> <"usa-background-gray-lightest" <"usa-grid" <"usa-width-one-half"li> <"usa-width-one-half"p> > > <"clear">')
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
                    .withOption('searchable', false)
                    .withOption('orderable', false),
                DTColumnBuilder.newColumn('name')
                    .withTitle('Name')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        var infoIcon = '<i class="fa fa-info-circle jqUsersContactInfo" data-html="<div class=\'ui\'><div class=\'header\'>Contact Info</div><div class=\'content\'><strong>E-mail:</strong> ' + data['email'] + '<br/><strong>Phone:</strong> ' + (data['phone'] ? data['phone'] : 'Not Available') + '</div></div>"></i>';
                        return infoIcon + data['name'];
                    }),
                DTColumnBuilder.newColumn('organization').withTitle('Department/Sub-Tier Agency & Office').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('gsaRAC[, ]').withTitle('Roles').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('permissions').withTitle('Permissions').withOption('defaultContent', '')
            ];
        }
    ]);
}();
