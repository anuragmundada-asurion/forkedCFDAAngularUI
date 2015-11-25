(function(){
    "use strict"

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['program'];

    //////////////////////

    function addEditProgramController(program) {
        var vm = this;

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
            vm.program.$save();
        }
    }

})();