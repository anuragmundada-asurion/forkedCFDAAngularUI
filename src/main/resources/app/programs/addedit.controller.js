(function(){
    "use strict"

    angular
        .module('app')
        .controller('addEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['program'];

    //////////////////////

    function addEditProgramController(program) {
        vm.program = program;
    }

})();