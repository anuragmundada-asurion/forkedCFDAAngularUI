(function(){
    "use strict";

    var myApp = angular
        .module('app');

    myApp.controller('ProgramsListController', programsListController);

    programsListController.$inject = ['$state', 'appConstants', 'Program'];

    //////////////////////

    myApp.config(function($stateProvider, $urlRouterProvider){

       // $urlRouterProvider.otherwise("/main/tabAll");

        $stateProvider.
           state('main', {
                abstract: true,
                url:"/main",
                templateUrl:"programs/programs-list.tpl.html"
           }).
           state('/tabPending', {
               templateUrl: 'programs/programs-list-table-all.tpl.html',
               controller: 'tabPending'
           }).
           state('/tabPublished',{
               templateUrl: 'programs/programs-list-table-all.tpl.html',
               controller: 'tabPublished'
           }).
           state('/tabAll',{
               templateUrl: 'programs/programs-list-table-all.tpl.html',
               controller: 'tabAll'
           }).
           state('/tabArchived',{
                templateUrl: 'programs/programs-list-table-all.tpl.html',
                controller: 'tabArchived'
           }).
           state('/tabRequests',{
                templateUrl: 'programs/programs-list-table-all.tpl.html',
                controller: 'tabRequests'
           });

    });

    function programsListController($state, appConstants, Program) {
        var vm = this;
        var previousState;

        angular.extend(vm, {
            itemsByPage: appConstants.DEFAULT_PAGE_ITEM_NUMBER,
            itemsByPageNumbers: appConstants.PAGE_ITEM_NUMBERS,

            loadPrograms: loadPrograms,
            editProgram: editProgram,
            deleteProgram: deleteProgram,
            getTabClass: getTabClass,
            getSelectedTab: getSelectedTab,
            setSelectedTab: setSelectedTab
        });

        /////////////////////

        function getTabClass(tab) {
            if (vm.selectedTab == tab) {
                return "active";
            } else {
                return "";
            }
         }


        function setSelectedTab(tab) {
            vm.selectedTab = tab;
        }

        function getSelectedTab() {
            return vm.selectedTab;
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
    myApp.controller('tabAll', function($scope, $http) {
     $scope.message = 'This is Tab1 space';
    });

    myApp.controller('tabPending', function($scope, $http) {
     $scope.message = 'This is Tab2 space';
    });

    myApp.controller('tabPublished', function($scope, $http) {
     $scope.message = 'This is Tab3 space';
    });

    myApp.controller('tabArchived', function($scope, $http) {
     $scope.message = 'This is Tab4 space';
    });

    myApp.controller('tabRequests', function($scope, $http) {
     $scope.message = 'This is Tab5 space';
    });

})();

