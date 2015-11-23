(function(){
    "use strict"

    angular
        .module('app')
        .controller('ProgramsListController', programsListController);

    programsListController.$inject = ['Program'];

    //////////////////////

    function programsListController(Program) {
        var vm = this;

        vm.loadPrograms = loadPrograms;

        /////////////////////

        function loadPrograms(tableState) {
            vm.isLoading = true;

            console.log(tableState);

            vm.programs = Program.query();

            vm.programs.$promise.then(function(){
                vm.isLoading = false;
            })
        }
    }

})();