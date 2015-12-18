(function(){
    "use strict";

    angular
        .module('app')
        .controller('ProgramsListController', programsListController);

    programsListController.$inject = ['$state', 'Program'];

    //////////////////////

    function programsListController($state, Program) {
        var vm = this,
            previousState;

        vm.itemsByPage = 10;

        vm.loadPrograms = loadPrograms;
        vm.editProgram = editProgram;
        vm.deleteProgram = deleteProgram;

        /////////////////////

        function loadPrograms(tableState) {
            vm.isLoading = true;
            var queryObj = {
                limit: vm.itemsByPage,
                offset: tableState.pagination.start,
                includeCount: true
            };
            if(angular.isDefined(tableState.sort.predicate)) {
                var isDescending = tableState.sort.reverse,
                    sortingProperty = tableState.sort.predicate;
                queryObj.sortBy = ( isDescending ? '-' : '' ) + sortingProperty;
            }
            console.log(tableState);

            vm.programs = Program.query(queryObj);

            vm.programs.$promise.then(function(data){
                vm.isLoading = false;
                var totalCount = data.$metadata.totalCount;

                tableState.pagination.numberOfPages = Math.ceil(totalCount / vm.itemsByPage);
                tableState.pagination.totalItemCount = totalCount;
                previousState = tableState;
            })
        }

        function editProgram(program) {
            $state.go('editProgram', {
                id: program._id
            });
        }

        function deleteProgram(program) {
            program.$delete().then(function() {
                loadPrograms(previousState);
            })
        }
    }

})();