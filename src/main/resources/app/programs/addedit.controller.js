(function(){
    "use strict";

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', '$filter', '$parse', '$document', '$window', 'util', 'appUtil', 'authTypeConstants', 'Dictionary', 'Program', 'program', 'coreChoices'];

    //////////////////////

    function addEditProgramController($state, $filter, $parse, $document, $window, util, appUtil, authTypeConstants, Dictionary, Programs, program, coreChoices) {
        var vm = this,
            scrollPromise,
            AMENDMENT_SELECTED_NAME = 'amendments',
            CURRENT_FISCAL_YEAR = util.getFiscalYear(),
            AUTH_VERSION_BASELINE = 1,
            ARRAY_ACTIONS = [
                { arrayName: 'authorizations', fnBaseName: 'Authorization', objCreateFn: createAuthorization, onRemoved: onAuthorizationRemoved },
                { arrayName: 'financial.accounts', fnBaseName: 'Account' },
                { arrayName: 'financial.obligations', fnBaseName: 'Obligation'},
                { arrayName: 'financial.treasury.tafs', fnBaseName: 'TAFSCode'},
                { arrayName: 'reports', fnBaseName: 'Report'},
                { arrayName: 'application.deadlines.submission.list', fnBaseName: 'Deadline'}
            ],
            DICTIONARIES = [
                'functional_codes',
                'program_subject_terms',
                'assistance_type',
                'applicant_types',
                'assistance_usage_types',
                'beneficiary_types',
                'date_range',
                'match_percent'
            ];
        vm.createAuthorization = createAuthorization;
        vm.onAuthorizationRemoved = onAuthorizationRemoved;
        vm.currentStep = null; //Must set to null due to a bug in angular-wizard
        if(!vm._id) vm._id = null; //Must set to fix filtering bug of undefined properties in Angular's $filter

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
        vm.types = {
            reportTypes: [
                'statement',
                'assessment'
            ]
        };

        angular.forEach(vm.fyTpls, function(tpl){
            tpl.idName = tpl.name.replace(/\s/g, '-');
            tpl.varName = tpl.type.toLowerCase();
            tpl.obligVarName = (tpl.obligType || tpl.type).toLowerCase();
            tpl.isRequired = tpl.type.toLowerCase() === "actual";
        });

        vm.uiLogic = {
            relatedProgramsFlag: !!program.relatedTo && !!program.relatedTo.length,
            fundedProjectsExampleFlag: hasFyFundedProjects()
        };
        vm.constants = authTypeConstants;
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
            ]
        };
        vm.choices.programs.$promise.then(function(data){
            var relatedTo = getArray('relatedTo');
            if(relatedTo.length > 0) {
                var idArr = data.map(function (item) {
                    return item._id;
                });
                vm.program.relatedTo = $filter('intersect')(relatedTo, idArr);
            }
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
        vm.createAmendment = createAmendment;
        vm.removeAmendment = removeAmendment;
        vm.updateAmendments = updateAmendments;
        vm.onAuthorizationTypeUpdate = onAuthorizationTypeUpdate;
        vm.getFormFiscalYearProject = getFormFiscalYearProject;
        vm.getItemFromType = getItemFromType;
        vm.revealValidations = revealValidations;
        vm.openDatepicker = openDatepicker;
        vm.addSelectedEntry = addSelectedEntry;
        vm.getSelectedEntry = getSelectedEntry;
        vm.removeSelectedEntry = removeSelectedEntry;
        vm.getAuthorizationTitle = appUtil.getAuthorizationTitle;
        vm.nextId = util.nextId;

        angular.forEach(ARRAY_ACTIONS, function(action){
            vm['add' + action.fnBaseName] = addGenerator(action.arrayName, action.objCreateFn || createObj);
            vm['remove' + action.fnBaseName] = removeGenerator(action.arrayName, action.onRemoved || angular.noop);
        });

        ////////////////

        function save() {
            var copy = angular.copy(vm.program);
            copy[copy._id ? '$update' : '$save']().then(updateId);
        }

        function updateId(res){
            vm.program._id = res._id;
            $window.alert("Your changes have been saved.")
        }

        function addGenerator(arrayName, createObjFn) {
            return function() {
                var newEntry = createObjFn();
                getArray(arrayName).push(newEntry);
                addSelectedEntry(newEntry, arrayName);
                vm.focusAuthAdd = true;
            }
        }

        function removeGenerator(arrayName, onRemoved) {
            return function($index) {
                var removedItem = getArray(arrayName).splice($index, 1)[0];
                if(getSelectedEntry(arrayName) === removedItem)
                    removeSelectedEntry(arrayName);
                onRemoved(removedItem);
            }
        }

        function onAuthorizationRemoved(authorization) {
            var amendments = getAuthorizationAmendments(authorization.authorizationId),
                authArray = getArray('authorizations');
            for(var i = 0; i < authArray.length; i++) {
                var authorization = authArray[i];
                if(amendments.indexOf(authorization) > - 1) {
                    authArray.splice(i, 1);
                    i--;
                }
            }
        }

        function createAmendment(authorization) {
            var authId = authorization.authorizationId,
                lastVersion = getLastAuthorizationVersion(authId);
            lastVersion.active = false;
            if(!angular.isDefined(lastVersion.version))
                lastVersion.version = AUTH_VERSION_BASELINE;
            return createAuthorization(authId, lastVersion.authorizationType, (lastVersion.version + 1));
        }

        function removeAmendment(amendment) {
            if(amendment.active) {
                var lastVersion = getLastAuthorizationVersion(amendment.authorizationId);
                if(angular.isObject(lastVersion))
                    lastVersion.active = true;
            }
        }

        function addSelectedEntry(entry, path, id) {
            generateSelectedEntryParse(path, id).assign(vm, entry);
        }

        function getSelectedEntry(path, id) {
            return generateSelectedEntryParse(path, id)(vm);
        }

        function removeSelectedEntry(path, id) {
            generateSelectedEntryParse(path, id).assign(vm, null);
        }

        function generateSelectedEntryParse(path, id) {
            if(id)
                path = path + "_" + id;
            path = "entries['" + path + "'].selected";
            return $parse(path);
        }

        function getLastAuthorizationVersion(authId) {
            var filteredArray = getAuthorizationAmendments(authId);
            return $filter('orderBy')(filteredArray, "-version")[0];
        }

        function updateAmendments(authorization) {
            var amendments = getAuthorizationAmendments(authorization.authorizationId);
            angular.forEach(amendments, function(amendment){
                onAuthorizationTypeUpdate(authorization, amendment);
            });
        }

        function onAuthorizationTypeUpdate(authorization, amendment) {
            if(amendment !== authorization)
                amendment.authorizationType = authorization.authorizationType;
        }

        function getAuthorizationAmendments(authId) {
            var authArray = getArray('authorizations');
            return $filter('filter')(authArray, { authorizationId: authId });
        }
        function getArray(arrayName){
            var getter = $parse(arrayName);
            return getter(vm.program) || getter.assign(vm.program, []);
        }

        function isAuthorization(authorization) {
            return !angular.isDefined(authorization.version) || authorization.version <= AUTH_VERSION_BASELINE;
        }
        function isPartOfAuth(auth) {
            return function(amendment) {
                return auth && amendment.authorizationId === auth.authorizationId
                    && amendment !== auth
            }
        }
        function generateAuthKey(authorization) {
            return authorization.authorizationId + authorization.version;
        }

        function createAuthorization(uuid, type, version) {
            return {
                authorizationId: uuid || util.generateUUID(),
                version: version || AUTH_VERSION_BASELINE,
                authorizationType: type,
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
                getArray('projectsArray').push(project);
            }
            return project;
        }

        function getFiscalYearProject(year) {
            var projectsArray = $filter('filter')(getArray('projectsArray'), { year: year }),
                fyProject = null;
            if(!!projectsArray.length)
                fyProject = projectsArray[0];
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

        function revealValidations() {
            var currentStep = vm.currentStep,
                validationFlag = vm.validationFlag || (vm.validationFlag = {});

            validationFlag[currentStep] = true;
            scrollToTop();
            return true;
        }

        function scrollToTop() {
            if(!scrollPromise) {
                $document.scrollToElementAnimated($document.findAll('#status-indicator-bar-anchor')).then(function(){
                    scrollPromise = null;
                });
            }
        }

        function openDatepicker($event, datepickerName) {
            $event.preventDefault();
            $event.stopPropagation();

            var datepickers = vm.datepickers || (vm.datepickers = {}),
                datepicker = datepickers[datepickerName] || (datepickers[datepickerName] = {});

            datepicker.opened = true;

        }

        function getItemFromType(array, type) {
            var item;

            angular.forEach(array, function(arrItem){
                if(arrItem.type === type)
                    item = arrItem;
            });
            if(!item) {
                item = {
                    type: type
                };
                array.push(item);
            }

            return item;
        }
    }

})();