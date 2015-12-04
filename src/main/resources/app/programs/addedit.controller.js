(function(){
    "use strict"

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', '$filter', 'uuid', 'Dictionary', 'program'];

    //////////////////////

    function addEditProgramController($state, $filter, uuid, Dictionary, program) {
        var vm = this,
            authVersionBaseline = 1,
            dictionaries = [
                'functional_codes',
                'program_subject_terms',
                'assistance_type'
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
                    id: 3,
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
            ]
        };
        vm.exps = {
            isAuthorization: isAuthorization,
            generateAuthKey: generateAuthKey,
            isPartOfAuth: isPartOfAuth
        };

        Dictionary.toDropdown({ id: dictionaries.join(',') }).$promise.then(function(data){
            angular.extend(vm.choices, data);
        });

        vm.save = save;
        vm.addAuthorization = addAuthorization;
        vm.removeAuthorization = removeAuthorization;
        vm.addAmendment = addAmendment;

        ////////////////

        function save() {
            var copy = angular.copy(vm.program);
            copy[copy._id ? '$update' : '$save']().then(updateId);
        }

        function updateId(res){
            vm.program._id = res._id;
        }

        function addAuthorization() {
            getArray('authorizations').push(createAuthorization(uuid.generateUUID(), authVersionBaseline));
            vm.focusAuthAdd = true;
        }

        function removeAuthorization($index) {
            getArray('authorizations').splice($index, 1);
        }

        function addAmendment(authId) {
            var authArray = getArray('authorizations'),
                filteredArray = $filter('filter')(authArray, { authorizationId: authId }),
                lastVersion = $filter('orderBy')(filteredArray, "-version")[0];
            lastVersion.active = false;
            if(!angular.isDefined(lastVersion.version))
                lastVersion.version = authVersionBaseline;
            authArray.push(createAuthorization(authId, (lastVersion.version + 1)))
            vm.focusAuthAdd = true;
        }

        function getArray(arrayName){
            return  vm.program[arrayName] || (vm.program[arrayName] = []);
        }

        function isAuthorization(authorization) {
            return !angular.isDefined(authorization.version) || authorization.version <= authVersionBaseline;
        }
        function isPartOfAuth(auth) {
            return function(amendment) {
                return amendment.authorizationId === auth.authorizationId
                    && amendment !== auth
            }
        }
        function generateAuthKey(authorization) {
            return authorization.authorizationId + authorization.version;
        }

        function createAuthorization(uuid, version) {
            return {
                authorizationId: uuid,
                version: version,
                active: true
            }
        }
    }

})();