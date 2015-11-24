(function(){
    "use strict"

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$anchorScroll', 'program'];

    //////////////////////

    function addEditProgramController($anchorScroll, program) {
        var vm = this;

        vm.program = program;

    }

})();