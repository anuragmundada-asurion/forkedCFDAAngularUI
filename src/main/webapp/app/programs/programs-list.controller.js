(function(){
    "use strict";

    angular
        .module('app')
        .controller('ProgramsListController', programsListController);

    programsListController.$inject = ['$state', 'appConstants', 'Program'];

    //////////////////////
    function programsListController($state, appConstants, Program) {
        var vm = this;
        var previousState;

        vm.tabs = [
            { title:'Open', content:'Dynamic content 1' },
            { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
        ];
        vm.selectedTab = vm.tabs[0];

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

})();