(function(){
    "use strict"

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', 'uuid', 'Dictionary', 'program'];

    //////////////////////

    function addEditProgramController($state, uuid, Dictionary, program) {
        var vm = this,
            dictionaries = [
                'picklist_functional_codes',
                'picklist_cfda_subject_terms',
                'picklist_assistance_types'
            ];

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
            eligibleApplicantsList: [
                {
                    id: 9,
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
            ],
            useOfAssistanceList: [
                {
                    id: 0,
                    name: '00 - No Functional Application/Unlimited Application'
                },
                {
                    id: 12,
                    name: '12 - Agriculture/Forestry/Fish and Game'
                },
                {
                    id: 14,
                    name: '14 - Business/Commerce'
                },
                {
                    id: 16,
                    name: '16 - Civil Defense/Disaster Prevention and Relief/Emergency Preparedness'
                },
                {
                    id: 18,
                    name: '18 - Communications'
                },
                {
                    id: 20,
                    name: '20 - Community Development (includes Federal surplus property)'
                },
                {
                    id: 22,
                    name: '22 - Construction/Renewal/Rehabilitation'
                }
            ],

        };
        Dictionary.toDropdown({ id: dictionaries.join(',') }).$promise.then(function(data){
            angular.extend(vm.choices, data);
        });
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