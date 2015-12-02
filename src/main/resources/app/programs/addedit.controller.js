(function(){
    "use strict"

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', 'uuid', 'program'];

    //////////////////////

    function addEditProgramController($state, uuid, program) {
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

        vm.choices = {
            eligibleApplicantsList: [
                {
                    id: 09,
                    name: '09 - Government - General'
                },
                {
                    id: 10,
                    name: '10 - Federal'
                },
                {
                    id: 11,
                    name: '11 - Interstate'
                },
                {
                    id: 12,
                    name: '12 - Intrastate'
                },
                {
                    id: 14,
                    name: '14 - State (includes District of Columbia, public institutions of higher education and hospitals)'
                },
                {
                    id: 15,
                    name: '15 - Local (includes State-designated Indian Tribes, excludes institutions of higher education and hospitals)'
                },
                {
                    id: 18,
                    name: '18 - Sponsored organization'
                }
            ]
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