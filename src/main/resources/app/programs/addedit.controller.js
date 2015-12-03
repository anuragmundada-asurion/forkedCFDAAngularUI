(function(){
    "use strict"

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', 'uuid', 'Dictionary', 'program'];

    //////////////////////

    function addEditProgramController($state, uuid, Dictionary, program) {
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
            ],
            funcCodes: Dictionary.toDropdown({ id: 'picklist_functional_codes' })
        };
        vm.save = save;
        vm.addAuthorization = addAuthorization;
        vm.removeAuthorization = removeAuthorization;

        ////////////////

        function save() {
            var copy = angular.copy(vm.program);
            copy[copy.id ? '$update' : '$save']().then(updateId);
        }

        function updateId(res){
            vm.program.id = res.id;
        }

        function addAuthorization() {
            getArray('authorizations').push({
                authorizationId: uuid.generateUUID()
            });
            vm.focusAuthAdd = true;
        }

        function removeAuthorization($index) {
            getArray('authorizations').splice($index, 1);
        }

        function getArray(arrayName){
            return  vm.program[arrayName] || (vm.program[arrayName] = []);
        }
    }

})();