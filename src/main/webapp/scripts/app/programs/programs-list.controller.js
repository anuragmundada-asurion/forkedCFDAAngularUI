(function(){
    "use strict";

    angular
        .module('app')
        .controller('ProgramsListController', programsListController);

    programsListController.$inject = ['$state', 'appConstants', 'Program'];

    //////////////////////

    function programsListController($state, appConstants, Program) {
        var vm = this,
            previousState;

        angular.extend(vm, {
            itemsByPage: appConstants.DEFAULT_PAGE_ITEM_NUMBER,
            itemsByPageNumbers: appConstants.PAGE_ITEM_NUMBERS,

            loadPrograms: loadPrograms,
            editProgram: editProgram,
            deleteProgram: deleteProgram
        });

        /////////////////////

        function loadPrograms(tableState) {
            vm.isLoading = true;
            var queryObj = {
                limit: vm.itemsByPage,
                offset: tableState.pagination.start,
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
            program.$delete().then(function() {
                loadPrograms(previousState);
            })
        }
    }

})();