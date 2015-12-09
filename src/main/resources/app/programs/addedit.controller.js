(function(){
    "use strict";

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', '$filter', 'util', 'Dictionary', 'Program', 'program', 'coreChoices'];

    //////////////////////

    function addEditProgramController($state, $filter, util, Dictionary, Programs, program, coreChoices) {
        var vm = this,
            CURRENT_FISCAL_YEAR = util.getFiscalYear(),
            AUTH_VERSION_BASELINE = 1,
            ARRAY_ACTIONS = [
                { arrayName: 'authorizations', fnBaseName: 'Authorization', objCreateFn: createAuthorization },
                { arrayName: 'accountcodes', fnBaseName: 'AccountCode' },
                { arrayName: 'obligations', fnBaseName: 'Obligation'},
                { arrayName: 'tafscodes', fnBaseName: 'TAFSCode'}
            ],
            DICTIONARIES = [
                'functional_codes',
                'program_subject_terms',
                'assistance_type',
                'applicant_types',
                'applicant_usage_types',
                'beneficiary_types'
            ];

        vm.isEdit = $state.is('editProgram');

        vm.program = program;

        vm.fyTpls = [
            {
                name: "Past Fiscal Year",
                year: CURRENT_FISCAL_YEAR - 1,
                type: 'Actual'
            },
            {
                name: "Current Fiscal Year",
                year: CURRENT_FISCAL_YEAR,
                type: 'Projection',
                obligType: 'Estimate'
            },
            {
                name: "Budget Fiscal Year",
                year: CURRENT_FISCAL_YEAR + 1,
                type: 'Projection',
                obligType: 'Estimate'
            }
        ];

        angular.forEach(vm.fyTpls, function(tpl){
            tpl.idName = tpl.name.replace(/\s/g, '-');
            tpl.varName = tpl.type.toLowerCase();
            tpl.isRequired = tpl.type.toLowerCase() === "actual";
        });

        vm.uiLogic = {
            relatedProgramsFlag: !!program.relatedTo && !!program.relatedTo.length,
            fundedProjectsExampleFlag: hasFyFundedProjects()
        };
        vm.choices = {
            programs: Programs.query(),
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
            ]
        };
        vm.choices.programs.$promise.then(function(data){
            var idArr = data.map(function(item) {
                return item._id;
            });
            vm.program.relatedTo = $filter('intersect')(vm.program.relatedTo, idArr);
        });
        vm.exps = {
            isAuthorization: isAuthorization,
            generateAuthKey: generateAuthKey,
            isPartOfAuth: isPartOfAuth
        };
        vm.groupByFns = {
            multiPickerGroupByFn: function(item) {
                return !!item.parent ? item.parent.value : item.value;
            }
        };
        angular.extend(vm.choices, coreChoices);
        Dictionary.toDropdown({ id: DICTIONARIES.join(',') }).$promise.then(function(data){
            angular.extend(vm.choices, data);
        });

        vm.save = save;
        vm.addAmendment = addAmendment;
        vm.removeAmendment = removeAmendment;
        vm.getFormFiscalYearProject = getFormFiscalYearProject;
        vm.log = function($item, $model) {
            console.log($item);
        }

        angular.forEach(ARRAY_ACTIONS, function(action){
            vm['add' + action.fnBaseName] = addGenerator(action.arrayName, action.objCreateFn || createObj);
            vm['remove' + action.fnBaseName] = removeGenerator(action.arrayName);
        });

        ////////////////

        function save() {
            var copy = angular.copy(vm.program);
            copy[copy._id ? '$update' : '$save']().then(updateId);
        }

        function updateId(res){
            vm.program._id = res._id;
        }

        function addGenerator(arrayName, createObjFn) {
            return function() {
                getArray(arrayName).push(createObjFn());
                vm.focusAuthAdd = true;
            }
        }

        function removeGenerator(arrayName) {
            return function($index) {
                getArray(arrayName).splice($index, 1);
            }
        }

        function addAmendment(authId) {
            var authArray = getArray('authorizations'),
                lastVersion = getLastAuthorizationVersion(authId);
            lastVersion.active = false;
            if(!angular.isDefined(lastVersion.version))
                lastVersion.version = AUTH_VERSION_BASELINE;
            authArray.push(createAuthorization(authId, (lastVersion.version + 1)));
            vm.focusAuthAdd = true;
        }

        function removeAmendment(amendment) {
            var authArray = getArray('authorizations');
            for(var i = 0; i < authArray.length; i++) {
                if(authArray[i] === amendment) {
                    authArray.splice(i, 1);
                    break;
                }
            }
            if(amendment.active) {
                var lastVersion = getLastAuthorizationVersion(amendment.authorizationId);
                if(angular.isObject(lastVersion))
                    lastVersion.active = true;
            }
        }

        function getLastAuthorizationVersion(authId) {
            var authArray = getArray('authorizations'),
                filteredArray = $filter('filter')(authArray, { authorizationId: authId });
            return $filter('orderBy')(filteredArray, "-version")[0];
        }

        function getArray(arrayName){
            return  vm.program[arrayName] || (vm.program[arrayName] = []);
        }

        function isAuthorization(authorization) {
            return !angular.isDefined(authorization.version) || authorization.version <= AUTH_VERSION_BASELINE;
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
                authorizationId: uuid || util.generateUUID(),
                version: version || AUTH_VERSION_BASELINE,
                active: true
            }
        }

        function createObj() {
            return {
                id: util.generateUUID()
            }
        }

        function getFormFiscalYearProject(year) {
            var project = getFiscalYearProject(year);
            if(!project) {
                project = { year: year };
                getArray('projects').push(project);
            }
            return project;
        }

        function getFiscalYearProject(year) {
            var projects = $filter('filter')(getArray('projects'), { year: year }),
                fyProject = null;
            if(!!projects.length)
                fyProject = projects[0];
            return fyProject;
        }

        function hasFyFundedProjects() {
            var hasFundedProjects = true;
            angular.forEach(vm.fyTpls, function(fyTpl){
                var project = getFiscalYearProject(fyTpl.year);
                if(hasFundedProjects)
                    hasFundedProjects = !!project && !!project[fyTpl.varName];
            });

            return hasFundedProjects;
        }
    }

})();