!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserListCtrl', ['$scope', 'ApiService', 'FederalHierarchyService', 'DTColumnBuilder', 'DTOptionsBuilder', '$q', '$compile', 'AuthorizationService', 'SUPPORTED_ROLES', 'ROLES', 'UserService', '$state', '$stateParams', 
        function($scope, ApiService, FederalHierarchyService, DTColumnBuilder, DTOptionsBuilder, $q, $compile, AuthorizationService, SUPPORTED_ROLES, ROLES, UserService, $state, $stateParams) {
            $scope.searchKeyword = '';
            $scope.dtInstance = {};
            $scope.defaultRoleText = {
                selectAll       : '&nbsp;&nbsp;Select All',
                selectNone      : '&nbsp;&nbsp;Select None',
                reset           : '&nbsp;&nbsp;Reset',
                search          : 'Search...',
                nothingSelected : "Select Roles"
            };
            $scope.filter = {
                roleFilter: [],
                organizationFilter: (typeof $stateParams.organization !== 'undefined') ? $stateParams.organization : ''
            };
            $scope.showOMBAllOrganization = UserService.hasUserAllOrgIDs();

            //OMB load his custom organizations
            if(AuthorizationService.authorizeByRole([SUPPORTED_ROLES.OMB_ANALYST]) && !$scope.showOMBAllOrganization){
                FederalHierarchyService.getFederalHierarchyByIds(UserService.getUserAllOrgIDs(), false, false, function(data){
                    $scope.aOrganization = $scope.getFhIDs(data._embedded.hierarchy);
                }, function(error){});
            }

            $scope.getFhIDs = function(aData){
                var aIDs = [];

                angular.forEach(aData, function(item){
                    aIDs.push({elementId: item.elementId, name: item.name});

                    if(item.hasOwnProperty('hierarchy')){
                        aIDs = aIDs.concat($scope.getFhIDs(item.hierarchy));
                    }
                });

                return aIDs;
            };

            if (ROLES.isPopulated) {
                $scope.availableRoles = [{
                    'element_id': SUPPORTED_ROLES.AGENCY_USER,
                    'displayValue': ROLES[SUPPORTED_ROLES.AGENCY_USER]['name']
                },{
                    'element_id': SUPPORTED_ROLES.AGENCY_COORDINATOR,
                    'displayValue': ROLES[SUPPORTED_ROLES.AGENCY_COORDINATOR]['name']
                },{
                    'element_id': SUPPORTED_ROLES.OMB_ANALYST,
                    'displayValue': ROLES[SUPPORTED_ROLES.OMB_ANALYST]['name']
                },{
                    'element_id': SUPPORTED_ROLES.RMO_SUPER_USER,
                    'displayValue': ROLES[SUPPORTED_ROLES.RMO_SUPER_USER]['name']
                }];

                if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.SUPER_USER]) || AuthorizationService.authorizeByRole([SUPPORTED_ROLES.LIMITED_SUPER_USER])) {
                    $scope.availableRoles.push({
                        'element_id': SUPPORTED_ROLES.LIMITED_SUPER_USER,
                        'displayValue': ROLES[SUPPORTED_ROLES.LIMITED_SUPER_USER]['name']
                    });$scope.availableRoles.push({
                        'element_id': SUPPORTED_ROLES.SUPER_USER,
                        'displayValue': ROLES[SUPPORTED_ROLES.SUPER_USER]['name']
                    });
                }
            }

            $scope.$watch('searchKeyword', function() {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.search($scope.searchKeyword).draw();
                }
            }, true);

            //  Refresh user table if filter gets changed
            $scope.$watch('filter', function () {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            }, true);

            $scope.clearSearchForm = function() {
                $state.go('userList', {organization: null}, {reload: true});
            };

            $scope.canEditUser = function(data) {
                var hasPermission = false;

                if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.AGENCY_COORDINATOR])) {
                    hasPermission = (data['role'] == SUPPORTED_ROLES.AGENCY_USER) || (data['role'] == SUPPORTED_ROLES.AGENCY_COORDINATOR);
                } else if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.RMO_SUPER_USER])) {
                    hasPermission = data['role'] == SUPPORTED_ROLES.OMB_ANALYST;
                } else if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.SUPER_USER])) {
                    hasPermission = true;
                }

                return hasPermission;
            };

            // Adding table loading state
            angular.element('table.usa-table-primary-darkest').on( 'processing.dt', function ( e, settings, processing ) {
              $('table.usa-table-primary-darkest, .datatable-bottom').addClass( processing ? 'datatable-loading' : '' );
              $('table.usa-table-primary-darkest, .datatable-bottom').removeClass( processing ? '' : 'datatable-loading' );
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('infoCallback', function(settings, start, end, max, total, pre) {
                    $scope.totalCount = total;
                })
                .withOption('initComplete', function(){
                    // Append info text for easier theming
                    $(".dataTables_info").appendTo(".dataTables_length label");
                    $(".dataTables_info").contents().unwrap();
                })
                .withOption('processing', true)
                .withOption('ajax', function(data, callback, settings) {
                    var oApiParam = {
                        apiName: 'userAPI',
                        apiSuffix: '',
                        oParams: {},
                        oData: {},
                        method: 'GET'
                    };

                    if ($scope.filter.roleFilter.length > 0) {
                        var roles = [];
                        angular.forEach($scope.filter.roleFilter, function(r) {
                            roles.push(r['element_id']);
                        });
                        oApiParam.oParams['roles'] = roles;
                    }

                    if ($scope.filter.organizationFilter) {
                        oApiParam.oParams['organizations'] = [$scope.filter.organizationFilter];

                        if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.AGENCY_COORDINATOR]) && $scope.filter.organizationFilter === UserService.getUserOrgId()) {
                            oApiParam.oParams['organizations'] = null;
                        }
                    }

                    ApiService.call(oApiParam).then(
                        function (results) {
                            var promises = [];
                            var tableData = [];
                            angular.forEach(results, function (r) {
                                r['name'] = {
                                    'name': r['fullName'],
                                    'email': r['email'],
                                    'id': r['id'],
                                    'phone': r['workPhone']
                                };
                                r['role'] = ROLES[r['role']]['name'];
                                if (r['organizationId']) {
                                    promises.push(FederalHierarchyService.getFederalHierarchyById(r['organizationId'], true, false, function (data) {
                                        r['organization'] = FederalHierarchyService.getFullNameFederalHierarchy(data);
                                    }, function () {
                                        r['organization'] = 'Organization Not Found';
                                    }));
                                } else {
                                    r['organization'] = 'No Organization Assigned';
                                }
                                r['action'] = {
                                    'id': r['id'],
                                    'role': r['role']
                                };
                                tableData.push(r);
                            });
                            $q.all(promises).then(function () {
                                callback(tableData);
                            });
                        }
                    );
                })
                .withOption('rowCallback', function(row, data, index) {
                    $(row).find('.jqUsersContactInfo').popup({
                        on: 'click',
                        position: 'left center',
                        html: '<div class="ui"><div class="header">Contact Info</div><div class="content"><strong>E-mail:</strong> ' + (data['email'] ? data['email'] : 'Not Available') + '<br/><strong>Phone:</strong> ' + (data['phone'] ? data['phone'] : 'Not Available') + '</div></div>'
                    });
                    $compile(row)($scope);
                })
                .withOption('searching', true)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDOM('<"usa-grid"r> <"usa-grid"t> <"usa-background-gray-lightest datatable-bottom" <"usa-grid" <"usa-width-one-half"li> <"usa-width-one-half"p> > > <"clear">')
                .withLanguage({
                    'processing': '<div class="ui active small inline loader"></div> Loading',
                    'emptyTable': 'No Users Found',
                    'lengthMenu': 'Showing _MENU_ entries',
                    'info': ' of _TOTAL_ entries'
                });
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('name')
                    .withTitle('Name')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        var infoIcon = '<i class="fa fa-info-circle jqUsersContactInfo"></i> ';
                        return infoIcon + '<a ui-sref="viewUser({id: \'' + data['id'] + '\'})">' + data['name'] + '</a>';
                    }),
                DTColumnBuilder.newColumn('organization').withTitle('Department/Sub-Tier Agency & Office').withOption('defaultContent', '').withOption('sWidth', '380px'),
                DTColumnBuilder.newColumn('role').withTitle('Roles').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('permissions').withTitle('Permissions').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('action')
                    .withTitle('Action')
                    .withOption('defaultContent', '')
                    .withOption('searchable', false)
                    .withOption('orderable', false)
                    .withOption('render', function(data) {
                        if ($scope.canEditUser(data)) {
                            return '<a ui-sref="editUser({id: \'' + data['id'] + '\'})"><button class="usa-button-compact" type="button"><span class="fa fa-pencil"></span></button></a>';
                        } else {
                            return '';
                        }
                    })
            ];
        }
    ]);
}();
