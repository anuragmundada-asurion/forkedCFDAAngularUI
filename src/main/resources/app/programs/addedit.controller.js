(function(){
    "use strict"

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', 'program'];

    //////////////////////

    function addEditProgramController($state, program) {
        var vm = this;

        vm.isEdit = $state.is('editProgram');

        vm.program = program;
        vm.choices = {
            offices: [
                {
                    id: 1,
                    name: 'Test Office'
                },
                {
                    id: 2,
                    name: 'Dev Office'
                },
                {
                    id: 1,
                    name: 'Admin Office'
                }
            ]
        };

        vm.save = save;

        ////////////////

        function save() {
            var copy = angular.copy(vm.program);
            copy[copy.id ? '$update' : '$save']().then(updateId);
        }

        function updateId(res){
            vm.program.id = res.id;
        }
    }

})();