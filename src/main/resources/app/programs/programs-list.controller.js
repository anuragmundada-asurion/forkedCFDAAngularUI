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

        vm.loadPrograms = loadPrograms;
        vm.editProgram = editProgram;
        vm.deleteProgram = deleteProgram;

        /////////////////////

        function loadPrograms(tableState) {
            vm.isLoading = true;

            console.log(tableState);

            vm.programs = Program.query({
                limit: 100
            });

            vm.programs.$promise.then(function(){
                vm.isLoading = false;
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