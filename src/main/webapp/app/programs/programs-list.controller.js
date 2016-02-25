(function(){
    "use strict";

    var myApp = angular
        .module('app');

    myApp.controller('ProgramsListCtrl', ['$scope', '$state', '$location', '$stateParams', 'appConstants', 'ProgramService', function($scope, $state, $location, $stateParams, appConstants, ProgramService) {
        $scope.previousState = null;
        $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
        $scope.itemsByPageNumbers= appConstants.PAGE_ITEM_NUMBERS;
        $scope.programStatus = 'All';

        //updating scope programStatus parent for tabs/query puposes
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
            } else if($stateParams.status === 'all') {
                $scope.programStatus = 'All';
                $scope.$parent.programStatus = 'All';
            }
        } else {
            //main page, go to All tab
            $state.go('programList.status', {status: 'all'});
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
                apiName: 'listProgram',
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

            //for unit test purposes $scope.hasOwnProperty('$parent')
            if($scope.programStatus === 'requests') {
                oApiParam.apiSuffix = $scope.programStatus;
            } else if( $scope.programStatus !== 'All') {
                oApiParam.oParams['status'] = $scope.programStatus;
            }

            if(tableState.sort.predicate) {
                var isDescending = tableState.sort.reverse,
                    sortingProperty = tableState.sort.predicate;
                oApiParam.oParams['sortBy'] = ( isDescending ? '-' : '' ) + sortingProperty;
            }

            //call api and get results
            $scope.promise = ProgramService.query(oApiParam).then(
                function(data) {
                    var programs = [];
                    //cleanup and adjust strutre data
                    if($scope.programStatus === 'requests'){
                        programs = data.results;
                    } else {
                        angular.forEach(data.results, function (item) {
                            angular.forEach(item, function (prop, key) {
                                if (!prop._id)
                                    prop._id = key;
                                programs.push(prop);
                            });
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
                id: program._id,
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
})();

