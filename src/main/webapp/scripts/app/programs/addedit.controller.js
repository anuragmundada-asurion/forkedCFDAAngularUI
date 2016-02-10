(function(){
    "use strict";

    angular
        .module('app')
        .controller('AddEditProgram', addEditProgramController);

    addEditProgramController.$inject = ['$state', '$filter', '$parse', 'util', 'appUtil', 'appConstants', 'Dictionary', 'Program', 'program', 'Contact', 'coreChoices'];

    //////////////////////

    function addEditProgramController($state, $filter, $parse, util, appUtil, appConstants, Dictionary, Programs, program, Contacts, coreChoices) {

        var vm = this,
            CURRENT_FISCAL_YEAR = util.getFiscalYear(),
            AUTH_VERSION_BASELINE = 1,
            DICTIONARIES = [
                'program_subject_terms',
                'date_range',
                'match_percent'
            ],
            TREES = [
                'assistance_type',
                'applicant_types',
                'assistance_usage_types',
                'beneficiary_types',
                'functional_codes'
            ];
        vm.program = program;

        angular.extend(vm, {
            isEdit: $state.is('editProgram'),
            IsVisible: true,
            validationFlag: {},
            datepickers: {},
            fyTpls: [
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
            ],
            types: {
                reportTypes: appConstants.REPORT_TYPES
            },
            groupByFns: {
            multiPickerGroupByFn: function(item) {
                return !!item.parent ? item.parent.value : item.value;
            }
        },
            choices: angular.extend({
                programs: Programs.query({ limit: 1000 }),
                contacts: Contacts.query({ agencyId: vm.program.agencyId}),
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
            }, coreChoices),
            trees: {},
            filters: {
                traverseTree: $filter('traverseTree')
            },
            exps: {
                isAuthorization: isAuthorization,
                generateAuthKey: generateAuthKey,
                isPartOfAuth: isPartOfAuth
            },
            createAuthorization: createAuthorization,
            onAuthorizationRemoved: onAuthorizationRemoved,
            save: save,
            saveAndFinishLater: saveAndFinishLater,
            cancelForm: cancelForm,
            createAmendment: createAmendment,
            removeAmendment: removeAmendment,
            getAuthAmendments: getAuthAmendments,
            onAuthorizationSave: onAuthorizationSave,
            onAmendmentBeforeSave: onAmendmentBeforeSave,
            onAuthDialogOpen: onAuthDialogOpen,
            onAuthorizationTypeUpdate: onAuthorizationTypeUpdate,
            getFormFiscalYearProject: getFormFiscalYearProject,
            revealValidations: revealValidations,
            onSectionChange: onSectionChange,
            openDatepicker: openDatepicker,
            getChoiceModel: getChoiceModel,
            formatModelString: formatModelString,
            getTreeNodeModel: getTreeNodeModel,
            createContact: createContact,
            getAuthorizationTitle: appUtil.getAuthorizationTitle,
            getAmendmentTitle: appUtil.getAuthorizationTitle,
            getAccountTitle: appUtil.getAccountTitle,
            getObligationTitle: appUtil.getObligationTitle,
            getTafsTitle: appUtil.getTafsTitle,
            getDeadlineTitle: appUtil.getDeadlineTitle,
            getContactTitle: appUtil.getContactTitle,
            nextId: util.nextId
        });

        Dictionary.toDropdown({ ids: DICTIONARIES.join(',') }).$promise.then(function(data){
            angular.extend(vm.choices, data);
        });

        Dictionary.query({ ids: TREES.join(',') }, function(data){
            angular.extend(vm.trees, data);
        });

        angular.forEach(vm.fyTpls, function(tpl){
            tpl.idName = tpl.name.replace(/\s/g, '-');
            tpl.varName = tpl.type.toLowerCase();
            tpl.obligVarName = (tpl.obligType || tpl.type).toLowerCase();
            tpl.isRequired = tpl.type.toLowerCase() === "actual";
        });


        vm.choices.programs.$promise.then(function(data){
            var relatedTo = getArray('relatedTo');
            if(relatedTo.length > 0) {
                var idArr = data.map(function (item) {
                    return item._id;
                });
                vm.program.relatedTo = $filter('intersect')(relatedTo, idArr);
            }
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
         //   if(vm.form.$dirty) {
         //       alert("Are you sure you want to leave?");
         //   }
            $state.go('home');
        }

        function updateId(res){
            vm.program._id = res._id;
           // $window.alert("Your changes have been saved.")
        }
        function onAuthorizationSave(authorization) {
            var amendments = getAuthorizationAmendments(authorization.authorizationId);
            angular.forEach(amendments, function(amendment){
                onAuthorizationTypeUpdate(authorization, amendment);
            });
        }
        function onAuthorizationRemoved(authorization) {
            var amendments = getAuthorizationAmendments(authorization.authorizationId),
                authArray = getArray('authorizations');
            for(var i = 0; i < authArray.length; i++) {
                var srchAuthorization = authArray[i];
                if(amendments.indexOf(srchAuthorization) > - 1) {
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

        function getLastAuthorizationVersion(authId) {
            var filteredArray = getAuthorizationAmendments(authId);
            return $filter('orderBy')(filteredArray, "-version")[0];
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

        function getChoiceModel(value, key, dictionaryName) {
            var getter = $parse(key),
                selectedChoice = null;

            angular.forEach(vm.choices[dictionaryName], function(choice){
                if (getter(choice) === value) {
                    selectedChoice = choice;
                }
            });

            return selectedChoice;
        }

        function formatModelString(value, key, dictionaryName, exp) {
            var model = getChoiceModel(value, key, dictionaryName);
            if (model) {
                return $parse(exp)(model);
            } else {
                return "Error: " + dictionaryName + " " + value + " not found";
            }
        }

        function getTreeNodeModel(value, keyName, childrenName, dictionaryName) {
            var selected = vm.filters.traverseTree([value], vm.trees[dictionaryName], {
                branches: {
                    X: {
                        keyProperty: $parse(keyName),
                        childrenProperty: $parse(childrenName)
                    }
                }
            })[0];
            return selected ? selected.$original : null;
        }

        function createContact() {
            return {
                type: 'headquarter'
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

        function onSectionChange(prevSectionKey) {
            save();
            revealValidations(prevSectionKey);
        }

        function revealValidations(prevSectionKey) {
            vm.validationFlag[prevSectionKey] = true;
        }

        function openDatepicker($event, datepickerName) {
            $event.preventDefault();
            $event.stopPropagation();

            var datepicker = vm.datepickers[datepickerName] || (vm.datepickers[datepickerName] = {});

            datepicker.opened = true;
        }
    }

})();