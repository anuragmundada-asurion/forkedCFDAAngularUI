(function(){
    "use strict";

    var myApp = angular
        .module('app');

    myApp.controller('ProgramsListController', programsListController);

    programsListController.$inject = ['$state', 'appConstants', 'Program', '$location'];

    //////////////////////

    myApp.config(function($stateProvider, $urlRouterProvider){

       // $urlRouterProvider.otherwise("/main/tabAll");
        $urlRouterProvider.when("", "/main/tabAll");
        $stateProvider.
           state('main', {
                url:"/main",
                templateUrl:"programs/programs-list.tpl.html"
           }).
           state('main.tabPending', {
               url: '/tabPending',
               templateUrl: 'programs/programs-list-table-all.tpl.html',
               controller: 'tabPending'
           }).
           state('main.tabPublished',{
               url: '/tabPublished',
               templateUrl: 'programs/programs-list-table-all.tpl.html',
               controller: 'tabPublished'
           }).
           state('main.tabAll',{
               url: '/tabAll',
               templateUrl: 'programs/programs-list-table-all.tpl.html',
               controller: 'tabAll'
           }).
           state('main.tabArchived',{
                url: '/tabArchived',
                templateUrl: 'programs/programs-list-table-all.tpl.html',
                controller: 'tabArchived'
           }).
           state('main.tabRequests',{
                url: '/tabRequests',
                templateUrl: 'programs/programs-list-table-requests.tpl.html',
                controller: 'tabRequests'
           });

    });

    function programsListController($state, appConstants, Program, $location) {
        var vm = this;
        var previousState;

        angular.extend(vm, {
            itemsByPage: appConstants.DEFAULT_PAGE_ITEM_NUMBER,
            itemsByPageNumbers: appConstants.PAGE_ITEM_NUMBERS,

            loadPrograms: loadPrograms,
            editProgram: editProgram,
            deleteProgram: deleteProgram,
            getTabStyle: getTabStyle
        });

        /////////////////////
        function getTabStyle(path) {
            console.log("path = " + path);
            if($location.path() == '/main/'+path){
                return "tab-selected";
            } else {
                return "";
            }
        }

        function loadPrograms(tableState) {
            tableState = tableState || {
                    search: {},
                    pagination: {},
                    sort: {}
                };
            vm.isLoading = true;
            var queryObj = {
                limit: vm.itemsByPage,
                offset: tableState.pagination.start || 0,
                includeCount: true
            };

            if (tableState.search.predicateObject) {
                queryObj['keyword'] = tableState.search.predicateObject.$;
            }

            if(tableState.sort.predicate) {
                var isDescending = tableState.sort.reverse,
                    sortingProperty = tableState.sort.predicate;
                queryObj.sortBy = ( isDescending ? '-' : '' ) + sortingProperty;
            }

            vm.programs = Program.query(queryObj);

            vm.programs.$promise.then(function(data){
                vm.isLoading = false;
                var totalCount = data.$metadata.totalCount;

                tableState.pagination.numberOfPages = Math.ceil(totalCount / vm.itemsByPage);
                tableState.pagination.totalItemCount = totalCount;
                previousState = tableState;
            })
        }

        function editProgram(program, section) {
            section = section || 'info';
            $state.go('editProgram', {
                id: program._id,
                section: section
            });
        }

        function deleteProgram(program) {
            return program.$delete().then(function() {
                vm.loadPrograms(previousState);
            });
        }
    }
    myApp.controller('tabAll', function($scope, $http, $injector) {
        $injector.invoke(myApp, this, {$scope: $scope});

         $scope.loadPrograms = $scope.loadPrograms;
    });

    myApp.controller('tabPending', function($scope, $http) {
        $scope.title = 'Open Federal Assistance Listings';
    });

    myApp.controller('tabPublished', function($scope, $http) {
        $scope.title = 'Open Federal Assistance Listings';
    });

    myApp.controller('tabArchived', function($scope, $http) {
        $scope.title = 'Open Federal Assistance Listings';
    });

    myApp.controller('tabRequests', function($scope, $http) {
        $scope.title = 'Federal Assistance Listings Requests';

    });

})();

