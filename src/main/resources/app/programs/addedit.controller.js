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

    }

})();