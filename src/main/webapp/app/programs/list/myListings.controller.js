!function(){
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('MyListingsCtrl', ['$scope', '$state', '$stateParams', 'ApiService', 'AuthorizationService', 'ngDialog', 'MyListingsService', 'FederalHierarchyService', 'DTOptionsBuilder', '$compile', '$q',
        function($scope, $state, $stateParams, ApiService, AuthorizationService, ngDialog, MyListingsService, FederalHierarchyService, DTOptionsBuilder, $compile, $q) {
            var self = this;
            $scope.listService = MyListingsService;

            if ($stateParams.hasOwnProperty("list")) {
                if (MyListingsService.hasList($stateParams.list)) {
                    MyListingsService.setList($stateParams.list);
                }
            }

            if ($stateParams.hasOwnProperty("filter")) {
                if (MyListingsService.hasFilter($stateParams.filter)) {
                    MyListingsService.setFilter($stateParams.filter);
                }
            }

            $scope.changeList = function(newList) {
                if (MyListingsService.hasList(newList)) {
                    $state.go('programList', {list: newList});
                }
            };

            $scope.changeFilter = function(newFilter) {
                if (MyListingsService.hasFilter(newFilter)) {
                    MyListingsService.searchKeyword = '';
                    $state.go('programList', {filter: newFilter});
                }
            };

            $scope.$watch(function() {
                return MyListingsService.searchKeyword;
            }, function() {
                self.reloadTable();
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
                            text: resultData['title']
                        },
                        'action': {
                            id: r['id'],
                            status: r['status'],
                            archived: r['archived']
                        },
                        'submittedDate': r['submittedDate'],
                        'publishedDate': r['publishedDate'],
                        'archivedDate': r['archived'],
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
                        'requestDate': r['entryDate']
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

            this.initializeTable = function() {
                if (!$scope.dtInstance) {
                    $scope.dtInstance = {};
                }
                
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('initComplete', function(settings, json){
                        // Initialize semantic ui dropdown
                        $(".dataTables_length select").addClass("ui compact dropdown").dropdown();
                        // Remove select to fix dropdown  double click bug
                        $(".dataTables_length select").remove();
                        // Append info text for easier theming
                        $(".dataTables_info").appendTo(".dataTables_length label");
                        $(".dataTables_info").contents().unwrap();
                    })
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    .withOption('searching', false)
                    .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                    .withDataProp('data')
                    .withDOM('<"top ui fixed container"r> <"ui fixed container"t> <"bottom background gray" <"ui fixed container" <"ui grid" <"two column row" <"column"li> <"column"p> > > > > <"clear">')
                    .withOption('rowCallback', function(row) {
                        $compile(row)($scope);
                    })
                    .withOption('ajax', this.loadTableItems)
                    .withLanguage({
                        'processing': '<div class="ui active small inline loader"></div> Loading',
                        'emptyTable': 'No ' + (MyListingsService.isRequestList() ? 'Requests' : 'Programs') +  ' Found',
                        'lengthMenu': 'Showing _MENU_ entries',
                        'info': ' of _TOTAL_ entries'
                    });
                $scope.dtColumns = MyListingsService.getCurrentColumns();
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
                    apiName: MyListingsService.isActiveList() || MyListingsService.isArchivedList() ? 'programList' : 'programRequest',
                    apiSuffix: '',
                    oParams: {
                        limit: data['length'] || 10,
                        offset: data['start'],
                        includeCount: true
                    },
                    oData: {},
                    method: 'GET'
                };

                if (MyListingsService.isActiveList()) {
                    if (MyListingsService.currentFilterId !== 'all') {
                        oApiParam.oParams['status'] = MyListingsService.currentFilterId;
                    }
                } else if (MyListingsService.isArchivedList()) {
                    oApiParam.oParams['status'] = 'Archived';
                } else {
                    oApiParam.oParams['completed'] = false;
                }

                if (MyListingsService.searchKeyword) {
                    oApiParam.oParams['keyword'] = MyListingsService.searchKeyword;
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
                        if (MyListingsService.isArchivedList() || MyListingsService.isActiveList()) {
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
                            template: '<div class="usa-alert usa-alert-success" role="alert">'+
                            '<div class="usa-alert-body">'+
                            '<p class="usa-alert-text">This program has been successfully deleted.</p>'+
                            '</div>'+
                            '</div>',
                            className: 'ngdialog-theme-default'
                        });

                        $timeout(function() {
                            self.reloadTable();
                            ngDialog.close();
                        }, 3000);
                    }, function(error){
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-error" role="alert">'+
                            '<div class="usa-alert-body">'+
                            '<h3 class="usa-alert-heading">Error Status</h3>'+
                            '<p class="usa-alert-text">An error has occurred, please try again!</p>'+
                            '</div>'+
                            '</div>',
                            className: 'ngdialog-theme-default'
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
                $scope.showProgramRequestModal({id: programId}, 'program_request', 'title_request', function() {
                    self.reloadTable();
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
                        type: 'success',
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

