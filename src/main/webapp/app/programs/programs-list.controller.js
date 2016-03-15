(function(){
    "use strict";

    var myApp = angular
        .module('app');

    myApp.controller('ProgramsListCtrl', ['$scope', '$state', '$stateParams', 'appConstants', 'ApiService', 
    function($scope, $state, $stateParams, appConstants, ApiService) {
        $scope.previousState = null;
        $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
        $scope.itemsByPageNumbers= appConstants.PAGE_ITEM_NUMBERS;
        $scope.programStatus = 'All';

        //updating scope programStatus parent for tabs/query purposes
        if($stateParams.hasOwnProperty('status')) {
            if($stateParams.status === 'published') {
                $scope.programStatus = 'Published';
                $scope.$parent.programStatus = 'Published';
            } else if($stateParams.status === 'archived') {
                $scope.programStatus = 'Archived';
                $scope.$parent.programStatus = 'Archived';
            } else if($stateParams.status === 'pending') {
                $scope.programStatus = 'Pending';
                $scope.$parent.programStatus = 'Pending';
            } else if($stateParams.status === 'requests') {
                $scope.programStatus = 'requests';
                $scope.$parent.programStatus = 'requests';
            } else {
                $scope.programStatus = 'All';
                $scope.$parent.programStatus = 'All';
            }
        } else {
            //main page, go to All tab
            $state.go('programList.status', { status: 'all' });
        }

        /**
         * Function loading programs
         * @param {type} tableState
         * @returns Void
         */
        $scope.loadPrograms = function(tableState) {
            tableState = tableState || {
                search: {},
                pagination: {},
                sort: {}
            };

            $scope.isLoading = true;

            var oApiParam = {
                apiName: 'programList',
                apiSuffix: '',
                oParams: {
                    limit: $scope.itemsByPage,
                    offset: tableState.pagination.start || 0,
                    includeCount: true
                }, 
                oData: {}, 
                method: 'GET'
            };

            if (tableState.search.predicateObject) {
                oApiParam.oParams['keyword'] = tableState.search.predicateObject.$;
            }

            if($scope.programStatus === 'requests') {
                oApiParam.apiName = 'programRequest';
                oApiParam.oParams['completed'] = false;
            } else if( $scope.programStatus !== 'All') {
                oApiParam.oParams['status'] = $scope.programStatus;
            }

            if(tableState.sort.predicate) {
                var isDescending = tableState.sort.reverse,
                    sortingProperty = tableState.sort.predicate;
                oApiParam.oParams['sortBy'] = ( isDescending ? '-' : '' ) + sortingProperty;
            }

            //call api and get results
            $scope.promise = ApiService.call(oApiParam).then(
                function(data) {
                    var programs = [];
                    //cleanup and adjust strutre data
                    if($scope.programStatus === 'requests'){
                        programs = data.results;
                    } else {
                        angular.forEach(data.results, function (item) {
                            programs.push(item);
                        });
                    }

                    $scope.programs = programs;
                    $scope.isLoading = false;

                    tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                    tableState.pagination.totalItemCount = data.totalCount;
                    $scope.previousState = tableState;
                }, 
                function(error){
                    
            });
        };

        /**
         * function for editing program
         * @param Object program
         * @param {type} section
         * @returns Void
         */
        $scope.editProgram= function(program, section) {
            section = section || 'info';
            $state.go('editProgram', {
                id: program.id,
                section: section
            });
        };

        /**
         * function for deleting program
         * @param Object program
         * @returns Q
         */
        $scope.deleteProgram = function(program) {
            return program.$delete().then(function() {
                $scope.loadPrograms($scope.previousState);
            });
        };
    }]);

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
                        programId: $scope.oEntity.id,
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
                        $state.go('programList.status', {status: 'all'});
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
})();

