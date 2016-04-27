!function(){
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('MyListingsCtrl', ['$scope', '$state', '$stateParams', 'ApiService', 'AuthorizationService', 'ngDialog', 'MyListingsService', 'FederalHierarchyService', 'DTOptionsBuilder', '$compile', '$q', '$timeout',
        function($scope, $state, $stateParams, ApiService, AuthorizationService, ngDialog, MyListingsService, FederalHierarchyService, DTOptionsBuilder, $compile, $q, $timeout) {
            var self = this;
            $scope.listService = MyListingsService;
            $scope.searchKeyword = '';
            $scope.currentListId = 'activePrograms';

            $scope.isActiveList = function() {
                return $scope.currentListId === 'activePrograms';
            };

            $scope.isArchivedList = function() {
                return $scope.currentListId === 'archivedPrograms';
            };

            $scope.isRequestList = function() {
                return $scope.currentListId === 'requests';
            };

            $scope.isProgramList = function() {
                return $scope.isActiveList() || $scope.isArchivedList();
            };

            if ($stateParams.hasOwnProperty("list")) {
                if (MyListingsService.hasList($stateParams.list)) {
                    $scope.currentListId = $stateParams.list;
                }
            }

            if ($stateParams.hasOwnProperty("filter")) {
                $scope.allFilters = false;
                $scope.filters = {
                    draft: false,
                    pending: false,
                    published: false,
                    rejected: false
                };
                if (angular.isArray($stateParams.filter)) {
                    angular.forEach($stateParams.filter, function(f) {
                        $scope.filters[f] = true;
                    });
                } else {
                    switch($stateParams.filter) {
                        case 'draft':
                            $scope.filters.draft = true;
                            break;
                        case 'pending':
                            $scope.filters.pending = true;
                            break;
                        case 'published':
                            $scope.filters.published= true;
                            break;
                        case 'rejected':
                            $scope.filters.rejected = true;
                            break;
                        default:
                            $scope.allFilters = true;
                            $scope.filters = {
                                draft: true,
                                pending: true,
                                published: true,
                                rejected: true
                            };
                            break;
                    }
                }
            } else {
                $scope.allFilters = true;
                $scope.filters = {
                    draft: true,
                    pending: true,
                    published: true,
                    rejected: true
                };
            }

            $scope.changeList = function(newList) {
                if (MyListingsService.hasList(newList)) {
                    $scope.currentListId = newList;
                    $scope.searchKeyword = '';
                }
            };

            $scope.$watch('currentListId', function() {
                self.initializeTable();
            }, true);

            $scope.$watch('searchKeyword', function() {
                self.reloadTable();
            }, true);

            $scope.toggleSelectAll = function() {
                $scope.allFilters = !$scope.allFilters;
                if ($scope.allFilters) {
                    $scope.filters = {
                        draft: true,
                        pending: true,
                        published: true,
                        rejected: true
                    };
                } else {
                    $scope.filters = {
                        draft: false,
                        pending: false,
                        published: false,
                        rejected: false
                    };
                }
            };

            $scope.$watch('filters', function(newValue, oldValue) {
                $scope.allFilters = $scope.filters.draft && $scope.filters.pending && $scope.filters.published && $scope.filters.rejected;
                if (newValue != oldValue) {
                    self.reloadTable();
                }
            }, true);

            this.parsePrograms = function(dtData, callback, d) {
                var results = d.results;
                var promises = [];
                var tableData = [];
                angular.forEach(results, function(r) {
                    var resultData = r['data'];
                    var row = {
                        'id': r['id'],
                        'programNumber': resultData['programNumber'] || '-',
                        'title': {
                            id: r['id'],
                            status: r['status'],
                            archived: r['archived'],
                            text: resultData['title'],
                            parentProgramId: r['parentProgramId']
                        },
                        'action': {
                            id: r['id'],
                            status: r['status'],
                            archived: r['archived']
                        },
                        'submittedDate': r['submittedDate'],
                        'publishedDate': r['publishedDate'],
                        'archivedDate': r['archived'] ? r['modifiedDate'] : null,
                        'status': r['archived'] ? 'Archived' : r['status']['value']
                    };
                    promises.push(FederalHierarchyService.getFederalHierarchyById(resultData['organizationId'], true, false, function(data) {
                        row['organization'] = FederalHierarchyService.getFullNameFederalHierarchy(data);
                    }, function() {
                        row['organization'] = 'Organization Not Found';
                    }));
                    tableData.push(row);
                });

                $q.all(promises).then(function() {
                    callback({
                        "draw": parseInt(dtData['draw']) + 1,
                        "recordsTotal": d['totalCount'],
                        "recordsFiltered": d['totalCount'],
                        "data": tableData
                    });
                    $scope.totalCount = d['totalCount'];
                });
            };

            this.parseRequests = function(dtData, callback, d) {
                var results = d.results;
                var tableData = [];
                angular.forEach(results, function(r) {
                    var row = {
                        'id': r['id'],
                        'title': {
                            id: r['id'],
                            program: r['program']
                        },
                        'requestType': r['requestType']['publicValue'],
                        'reason': r['reason'],
                        'action': {
                            row: r
                        },
                        'entryDate': r['entryDate']
                    };
                    tableData.push(row);
                });

                callback({
                    "draw": parseInt(dtData['draw']) + 1,
                    "recordsTotal": d['totalCount'],
                    "recordsFiltered": d['totalCount'],
                    "data": tableData
                });
                $scope.totalCount = d['totalCount'];
            };

            this.reloadTable = function() {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            };

            angular.element('#programsTable').on('draw.dt', function() {
                // Initialize semantic ui dropdown
                $(".dataTables_length select").addClass("ui compact dropdown").dropdown();
                // Remove select to fix dropdown  double click bug
                $(".dataTables_length select").remove();
                //initilize semantic ui dropdowns
                $(".jqChangeRequest.dropdown").dropdown();

                $compile(angular.element('.dataTables_length'))($scope);
            });

            this.initializeTable = function() {
                if (!$scope.dtInstance) {
                    $scope.dtInstance = {};
                }
                
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    .withOption('searching', false)
                    .withOption('info', false)
                    .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                    .withDataProp('data')
                    .withDOM('<"top ui fixed container"r> <"ui fixed container"t> <"bottom background gray" <"ui fixed container" <"ui grid" <"two column row" <"column"l> <"column"p> > > > > <"clear">')
                    .withOption('rowCallback', function(row) {
                        $compile(row)($scope);
                    })
                    .withOption('ajax', this.loadTableItems)
                    .withLanguage({
                        'processing': '<div class="ui active small inline loader"></div> Loading',
                        'emptyTable': 'No ' + ($scope.isRequestList() ? 'Requests' : 'Programs') +  ' Found',
                        'lengthMenu': 'Showing _MENU_ entries of {{totalCount}} entries'
                    });
                $scope.dtColumns = MyListingsService.getColumns($scope.currentListId);
            };

            /**
             * Function loading programs
             * @returns Void
             * @param data
             * @param callback
             * @param settings
             */
            this.loadTableItems = function(data, callback, settings) {
                var oApiParam = {
                    apiName: $scope.isActiveList() || $scope.isArchivedList() ? 'programList' : 'programRequest',
                    apiSuffix: '',
                    oParams: {
                        limit: data['length'] || 10,
                        offset: data['start'],
                        includeCount: true
                    },
                    oData: {},
                    method: 'GET'
                };

                if ($scope.isActiveList()) {
                    if (!$scope.allFilters) {
                        var statuses = [];
                        if ($scope.filters.draft) {
                            statuses.push('draft');
                        }

                        if ($scope.filters.pending) {
                            statuses.push('pending');
                        }

                        if ($scope.filters.published) {
                            statuses.push('published');
                        }

                        if ($scope.filters.rejected) {
                            statuses.push('rejected');
                        }

                        oApiParam.oParams['status'] = statuses.join(',');
                    }
                } else if ($scope.isArchivedList()) {
                    oApiParam.oParams['status'] = 'Archived';
                } else {
                    oApiParam.oParams['completed'] = false;
                }

                if ($scope.searchKeyword) {
                    oApiParam.oParams['keyword'] = $scope.searchKeyword;
                    oApiParam.oParams.offset = 0;
                }

                if (data['order']) {
                    var order = data['order'][0];
                    var columnName = data['columns'][order['column']]['data'];
                    if (columnName) {
                        oApiParam.oParams['sortBy'] = ( angular.equals(order['dir'], 'asc') ? '' : '-' ) + columnName;
                    }
                }

                ApiService.call(oApiParam).then(
                    function(d) {
                        if ($scope.isArchivedList() || $scope.isActiveList()) {
                            self.parsePrograms(data, callback, d);
                        } else {
                            self.parseRequests(data, callback, d);
                        }
                    },
                    function(error){

                    }
                );
            };

            /**
             * Function revise program
             * @param programId
             * @returns Void
             */
            $scope.reviseProgram = function(programId) {
                var oApiParam = {
                    apiName: 'programAction',
                    apiSuffix: '/' + programId + '/revise',
                    method: 'POST'
                };

                ApiService.call(oApiParam).then(
                    function(data){
                        var msg = 'A draft version for this listing already exists. Please click ok to proceed to this draft version.';
                        if (data['created']) {
                            msg = 'A draft version for this listing was successfully created. Please click ok to proceed to this draft version.';
                        }

                        var result = confirm(msg);
                        if (result) {
                            $state.go('editProgram', {id : data['id'], section: 'review'});
                        }

                    }
                );
            };

            /**
             * function for deleting program
             * @param programId
             * @returns Q
             */
            $scope.deleteProgram = function(programId) {
                if(confirm("Are you sure you want to delete this program?")) {
                    var oApiParam = {
                        apiName: 'programList',
                        apiSuffix: '/' + programId,
                        oParams: {},
                        oData: {
                            id: programId
                        },
                        method: 'DELETE'
                    };

                    ApiService.call(oApiParam).then(function() {
                        ngDialog.open({
                            template:
                            '<div class="ui ignored message positive">'+
                            'This program has been successfully deleted.'+
                            '</div>',
                            plain: true,
                            closeByEscape: true,
                            showClose: true
                        });

                        $timeout(function() {
                            self.reloadTable();
                            ngDialog.close();
                        }, 3000);
                    }, function(error){
                        ngDialog.open({
                            template: '<div class="ui ignored message error">'+
                            'An error has occurred, please try again!'+
                            '</div>',
                            plain: true,
                            closeByEscape: true,
                            showClose: true
                        });

                        $timeout(function() {
                            self.reloadTable();
                            ngDialog.close();
                        }, 3000);
                    });
                }
            };

            $scope.editProgram = function(programId) {
                $state.go('editProgram', {
                    id: programId,
                    section: 'review'
                });
            };

            $scope.requestArchive = function(programId) {
                $scope.showProgramRequestModal({id: programId}, 'program_request', 'archive_request', function() {
                    self.reloadTable();
                });
            };

            $scope.requestTitleChange = function(programId) {
                var oApiParam = {
                    apiName: 'programList',
                    apiSuffix: '/' + programId,
                    method: 'GET'
                };

                ApiService.call(oApiParam).then(function(oData) {
                    $scope.showProgramRequestModal(oData.data, 'program_request', 'title_request', function() {
                        self.reloadTable();
                    });
                });
            };

            $scope.requestUnarchive = function(programId) {
                $scope.showProgramRequestModal({id: programId}, 'program_request', 'unarchive_request', function() {
                    self.reloadTable();
                });
            };

            $scope.handleRequest = function(requestId, actionType) {
                var oApiParam = {
                    apiName: 'programRequest',
                    apiSuffix: '/' + requestId,
                    method: 'GET'
                };
                ApiService.call(oApiParam).then(function(data) {
                    $scope.showProgramRequestModal(data, 'program_request_action', actionType, function() {
                        self.reloadTable();
                    });
                });
            };

            this.initializeTable();
        }
    ]);

    //Controller for Program Status
    myApp.controller('ProgramRequestCtrl', ['$scope', '$state', '$timeout', 'ApiService', 'ngDialog',
        function($scope, $state, $timeout, ApiService, ngDialog) {
            //get the oEntity that was passed from ngDialog in 'data' option
            $scope.oEntity = $scope.ngDialogData.oEntity;

            if($scope.ngDialogData.typeEntity === 'program_request_action') {
                //populate field reason
                $scope.reason = $scope.ngDialogData.oEntity.reason;
            }

            /**
             * function for submitting changes RestAPI call backend
             * @returns Void
             */
            $scope.submitProgramRequest = function() {
            var message = {
                success: 'Your request has been submitted !',
                error: 'An error has occurred, please try again !'
            };

            if(typeof $scope.reason !== 'undefined' && $scope.reason !== '' && !$scope.submissionInProgress) {
                $scope.submissionInProgress = true;
                var oApiParam = {
                    apiName: '',
                    apiSuffix: '',
                    oParams: {}, 
                    oData: {}, 
                    method: 'POST'
                };

                //which action should we apply to (Program or Program Requests)
                if($scope.ngDialogData.typeEntity === 'program_request') {
                    //set API Name to call
                    oApiParam.apiName = 'programRequest';
                    //define API params
                    oApiParam.oData = {
                        //from listing programs we get $scope.oEntity.id /// from editPage program, we get : $scope.oEntity._id
                        programId: ($scope.oEntity.hasOwnProperty('id')) ? $scope.oEntity.id : $scope.oEntity._id,
                        requestType: $scope.ngDialogData.action,
                        reason: $scope.reason,
                        data: {}
                    };

                    //title change request has a new field (NEW TITLE)
                    if($scope.ngDialogData.action === 'title_request') {
                        if(typeof $scope.newTitle !== 'undefined' && $scope.newTitle !== '') {
                            oApiParam.oData.data.title = $scope.newTitle;
                        } else {
                            //prevent fron submitting unless he provided the "new title" of this request
                            return false;
                        }
                    }
                } else if($scope.ngDialogData.typeEntity === 'program_request_action') {
                    //set API Name to call
                    oApiParam.apiName = 'programRequestAction';
                    //define success message
                    message.success = 'Your request has been processed !';

                    //define API params
                    oApiParam.oData = {
                        requestId: $scope.oEntity.id,
                        actionType: $scope.ngDialogData.action,
                        reason: $scope.reason
                    };
                } else if ($scope.ngDialogData.typeEntity === 'program_submit') {
                    //set API Name to call
                    oApiParam.apiName = 'programAction';
                    //define success message
                    message.success = 'This program has been submitted for review!';

                    oApiParam.apiSuffix = '/' + $scope.oEntity._id + '/submit';

                    //define API params
                    oApiParam.oData = {
                        reason: $scope.reason
                    };
                }

                //Call API
                ApiService.call(oApiParam).then(
                function(data){
                    $scope.flash = {
                        type: 'positive',
                        message: message.success
                    };

                    //go to list page after 2 seconds
                    $timeout(function() {
                        //  Due to delay, can't use finally block
                        $scope.submissionInProgress = false;
                        ngDialog.closeAll();
                        if (angular.isFunction($scope.ngDialogData.callback)) {
                            $scope.ngDialogData.callback();
                        }
                    }, 2000);
                }, 
                function(error){
                    $scope.submissionInProgress = false;
                    $scope.flash = {
                        type: 'error',
                        message: message.error
                    };
                });
            } else {
                //show error form validation
                angular.forEach($scope.programRequestForm.$error.required, function(field) {
                    field.$setDirty();
                });
            }
        };

            /**
              *
              * @param String string
              * @returns Object
              */
            $scope.stringToJson = function(string) {
                return JSON.parse(string);
            };
    }]);
}();

