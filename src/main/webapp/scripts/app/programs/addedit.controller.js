(function(){
    "use strict";

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', '$filter', '$parse', '$document', '$window', 'util', 'appUtil', 'appConstants', 'Dictionary', 'Program', 'program', 'Contact', 'coreChoices'];

    //////////////////////

    function addEditProgramController($state, $filter, $parse, $document, $window, util, appUtil, appConstants, Dictionary, Programs, program, Contacts, coreChoices) {

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
        vm.constants = appConstants;

        var queryObj = {
            limit: 1000
        };
        var agencyIdObj = {
            agencyId: getAgencyId()
        };
        function getAgencyId() {
            return vm.program.agencyId;
        };
        vm.choices = {
            programs: Programs.query(queryObj),
            contacts: Contacts.query(agencyIdObj),
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

        angular.extend(vm, {
            save: save,
            saveAndFinishLater: saveAndFinishLater,
            cancelForm: cancelForm,
            createAmendment: createAmendment,
            removeAmendment: removeAmendment,
            updateAmendments: updateAmendments,
            getAuthAmendments: getAuthAmendments,
            onAuthorizationSave: onAuthorizationSave,
            onAmendmentBeforeSave: onAmendmentBeforeSave,
            onAuthDialogOpen: onAuthDialogOpen,
            onAuthorizationTypeUpdate: onAuthorizationTypeUpdate,
            getFormFiscalYearProject: getFormFiscalYearProject,
            getItemFromType: getItemFromType,
            revealValidations: revealValidations,
            onSectionChange: onSectionChange,
            openDatepicker: openDatepicker,
            addSelectedEntry: addSelectedEntry,
            getSelectedEntry: getSelectedEntry,
            removeSelectedEntry: removeSelectedEntry,
            createContact: createContact,
            getAuthorizationTitle: appUtil.getAuthorizationTitle,
            getAmendmentTitle: appUtil.getAuthorizationTitle,
            getAccountTitle: appUtil.getAccountTitle,
            getObligationTitle: appUtil.getObligationTitle,
            getTafsTitle: appUtil.getTafsTitle,
            getContactTitle: appUtil.getContactTitle,
            nextId: util.nextId
        });

        angular.forEach(ARRAY_ACTIONS, function(action){
            vm['add' + action.fnBaseName] = addGenerator(action.arrayName, action.objCreateFn || createObj);
            vm['remove' + action.fnBaseName] = removeGenerator(action.arrayName, action.onRemoved || angular.noop);
        });

        ////////////////////

        function save() {
            var copy = angular.copy(vm.program);
            copy[copy._id ? '$update' : '$save']().then(updateId);
        }

        function saveAndFinishLater(){
            save();
            $state.go('home');
        }

        function cancelForm(){
            if(vm.form.$dirty) {
         //       alert("Are you sure you want to leave?");
            }
            $state.go('home');
        }

        function updateId(res){
            vm.program._id = res._id;
           // $window.alert("Your changes have been saved.")
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

        function onAuthorizationSave(authorization) {
            var amendments = getAuthorizationAmendments(authorization.authorizationId);
            angular.forEach(amendments, function(amendment){
                onAuthorizationTypeUpdate(authorization, amendment);
            });
        }
        function onAuthorizationCancel(authorization) {
            //if()
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
                lastVersion = getLastAuthorizationVersion(authId) || authorization;
            if(!angular.isDefined(lastVersion.version))
                lastVersion.version = AUTH_VERSION_BASELINE;
            return createAuthorization(authId, lastVersion.authorizationType, (lastVersion.version + 1));
        }

        function onAmendmentBeforeSave(amendment, authorization) {
            var authId = amendment.authorizationId,
                lastVersion = getLastAuthorizationVersion(authId) || authorization;
            if(!amendment.$original) {
                lastVersion.active = false;
                amendment.active = true;
            }
        }

        function removeAmendment(amendment) {
            if(amendment.active) {
                var lastVersion = getLastAuthorizationVersion(amendment.authorizationId);
                if(angular.isObject(lastVersion))
                    lastVersion.active = true;
            }
        }

        function getAuthAmendments(authorization) {
            var authArray = getArray('authorizations'),
                filterFunc = isPartOfAuth(authorization);
            return $filter('filter')(authArray, filterFunc);
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
            /*var amendments = getAuthorizationAmendments(authorization.authorizationId);
            angular.forEach(amendments, function(amendment){
                onAuthorizationTypeUpdate(authorization, amendment);
            });*/
        }

        function onAuthDialogOpen(authorization, ctrlLocals) {
            ctrlLocals.amendmentFilter = isPartOfAuth(authorization);
        }

        function onAuthorizationTypeUpdate(authorization, amendment) {
            if(angular.isDefined(authorization) && angular.isDefined(amendment) && amendment !== authorization)
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
            return authorization && (!angular.isDefined(authorization.version) || authorization.version <= AUTH_VERSION_BASELINE);
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

        function createContact() {
            return {
                type: 'headquarter'
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

        function onSectionChange(prevSectionKey) {
            save();
            revealValidations(prevSectionKey);
        }

        function revealValidations(prevSectionKey) {
            var validationFlag = vm.validationFlag || (vm.validationFlag = {});

            validationFlag[prevSectionKey] = true;
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