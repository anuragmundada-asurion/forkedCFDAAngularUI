(function () {
    "use strict";

    angular
        .module('app')
        .controller('AddEditProgram',
        ['$stateParams', '$scope', '$location', '$state', '$filter', '$parse', '$timeout', 'ngDialog', 'ApiService', 'util', 'appUtil', 'appConstants', 'Dictionary', 'ProgramFactory', 'Contact', 'UserService', 'Program',
            function ($stateParams, $scope, $location, $state, $filter, $parse, $timeout, ngDialog, ApiService, util, appUtil, appConstants, Dictionary, ProgramFactory, Contacts, UserService, Program) {

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
                    ],
                    originalTitle; //original title is stored because Published programs cannot have title changed.

                //initialize program object
                if ($state.current['name'] === 'addProgram') { // Create Program
                    //vm.isCreateProgram = true;
                    vm.program  = new ProgramFactory();
                    vm.program._id = null;
                    vm.program.organizationId = UserService.getUser().orgId;
                } else { // Edit/Review program
                    //vm.isCreateProgram = false;
                    vm.program = {};
                    ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                        vm.program = data;
                        vm.originalTitle = vm.program.title;
                        //reload contacts when object is available
                        vm.choices.contacts = Contacts.query({agencyId: vm.program.organizationId});

                        if (vm.program.status === 'Pending') {
                            var oApiParam = {
                                apiName: 'programRequest',
                                apiSuffix: '',
                                oParams: {
                                    completed: false,
                                    programId: vm.program._id,
                                    type: 'submit'
                                },
                                oData: {},
                                method: 'GET'
                            };

                            ApiService.call(oApiParam).then(function (data) {
                                var results = data['results'];
                                if (results && results.length) {
                                    $scope.submissionRequest = results[0];
                                }
                            }, function (error) {
                                console.log(error);
                            });
                        }
                    });
                }

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
                        multiPickerGroupByFn: function (item) {
                            return !!item.parent ? item.parent.value : item.value;
                        }
                    },
                    choices: angular.extend({
                        programs: ProgramFactory.query({limit: 2500, status: 'Published'}),
                        contacts: (typeof vm.program.organizationId !== 'undefined') ? Contacts.query({agencyId: vm.program.organizationId}) : {},
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
                    }),
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
                    submitProgram: submitProgram,
                    validateProgramFields: validateProgramFields,
                    getAuthorizationTitle: appUtil.getAuthorizationTitle,
                    getAmendmentTitle: appUtil.getAuthorizationTitle,
                    getAccountTitle: appUtil.getAccountTitle,
                    getObligationTitle: appUtil.getObligationTitle,
                    getTafsTitle: appUtil.getTafsTitle,
                    getDeadlineTitle: appUtil.getDeadlineTitle,
                    getContactTitle: appUtil.getContactTitle,
                    nextId: util.nextId
                });

                Dictionary.toDropdown({ids: appConstants.CORE_DICTIONARIES.join(',')}).$promise.then(function (data) {
                    angular.extend(vm.choices, data);
                });

                Dictionary.toDropdown({ids: DICTIONARIES.join(',')}).$promise.then(function (data) {
                    angular.extend(vm.choices, data);
                });

                Dictionary.query({ids: TREES.join(',')}, function (data) {
                    angular.extend(vm.trees, data);
                });

                angular.forEach(vm.fyTpls, function (tpl) {
                    tpl.idName = tpl.name.replace(/\s/g, '-');
                    tpl.varName = tpl.type.toLowerCase();
                    tpl.obligVarName = (tpl.obligType || tpl.type).toLowerCase();
                    tpl.isRequired = tpl.type.toLowerCase() === "actual";
                });

                vm.choices.programs.$promise.then(function (data) {
                    var relatedPrograms = $parse('relatedPrograms')(vm.program);
                    var relatedTo = relatedPrograms ? $parse('relatedTo')(relatedPrograms, []) : [];
                    if (relatedTo && relatedTo.length > 0) {
                        var idArr = data.map(function (item) {
                            return item.data._id;
                        });
                        vm.program.relatedTo = $filter('intersect')(relatedTo, idArr);
                    }
                });

                ////////////////////

                function save(cbFnSuccess) {
                    var copy = angular.copy(vm.program);

                    if (!copy._id || !copy.status) {
                        copy.status = "Draft";
                    }

                    //title cannot be changed when the program is Published. Since the field
                    // is disabled, it won't be submitted with the form.
                    if ((copy.status === 'Published' || copy.status === 'published') && !copy.archived) {
                        copy.title = vm.originalTitle;
                    }

                    copy[copy._id ? '$update' : '$save']().then(function (data) {
                        //update current program and add _id
                        vm.program._id = data._id;

                        //callback function success
                        if (typeof cbFnSuccess === 'function') {
                            cbFnSuccess(data);
                        }
                    });
                }

                function saveAndFinishLater() {
                    save();
                    $state.go('programList');
                }

                function cancelForm() {
                    //   if(vm.form.$dirty) {
                    //       alert("Are you sure you want to leave?");
                    //   }
                    $state.go('programList');
                }

                function updateId(res) {
                    vm.program._id = res._id;
                    // $window.alert("Your changes have been saved.")
                }

                function onAuthorizationSave(authorization) {
                    var amendments = getAuthorizationAmendments(authorization.authorizationId);
                    angular.forEach(amendments, function (amendment) {
                        onAuthorizationTypeUpdate(authorization, amendment);
                    });
                }

                function onAuthorizationRemoved(authorization) {
                    var amendments = getAuthorizationAmendments(authorization.authorizationId),
                        authArray = getArray('authorizations');
                    for (var i = 0; i < authArray.length; i++) {
                        var srchAuthorization = authArray[i];
                        if (amendments.indexOf(srchAuthorization) > -1) {
                            authArray.splice(i, 1);
                            i--;
                        }
                    }
                }

                function createAmendment(authorization) {
                    var authId = authorization.authorizationId,
                        lastVersion = getLastAuthorizationVersion(authId) || authorization;
                    if (!angular.isDefined(lastVersion.version))
                        lastVersion.version = AUTH_VERSION_BASELINE;
                    return createAuthorization(authId, lastVersion.authorizationType, (lastVersion.version + 1));
                }

                function onAmendmentBeforeSave(amendment, authorization) {
                    var authId = amendment.authorizationId,
                        lastVersion = getLastAuthorizationVersion(authId) || authorization;
                    if (!amendment.$original) {
                        lastVersion.active = false;
                        amendment.active = true;
                    }
                }

                function removeAmendment(amendment) {
                    if (amendment.active) {
                        var lastVersion = getLastAuthorizationVersion(amendment.authorizationId);
                        if (angular.isObject(lastVersion))
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
                    if (angular.isDefined(authorization) && angular.isDefined(amendment) && amendment !== authorization)
                        amendment.authorizationType = authorization.authorizationType;
                }

                function getAuthorizationAmendments(authId) {
                    var authArray = getArray('authorizations');
                    return $filter('filter')(authArray, {authorizationId: authId});
                }

                function getArray(arrayName) {
                    var getter = $parse(arrayName);
                    return getter(vm.program) || getter.assign(vm.program, []);
                }

                function isAuthorization(authorization) {
                    return authorization && (!angular.isDefined(authorization.version) || authorization.version <= AUTH_VERSION_BASELINE);
                }

                function isPartOfAuth(auth) {
                    return function (amendment) {
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

                    angular.forEach(vm.choices[dictionaryName], function (choice) {
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
                    if (!project) {
                        project = {year: year};
                        getArray('projectsArray').push(project);
                    }
                    return project;
                }

                function getFiscalYearProject(year) {
                    var projectsArray = $filter('filter')(getArray('projectsArray'), {year: year}),
                        fyProject = null;
                    if (!!projectsArray.length)
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

                /**
                 * TODO: Split program validation into sections
                 * @param Object oProgram program to be validated
                 * @returns Boolean
                 */
                function validateProgramFields(oProgram) {
                    return !(!oProgram.title || !oProgram.authorizations || oProgram.authorizations.length == 0
                    || !oProgram.objective || !oProgram.assistanceTypes || oProgram.assistanceTypes.length == 0 || !oProgram.usage.restrictions.flag
                    || (oProgram.usage.restrictions.flag === vm.choices['yes_no'].yes.code && !oProgram.usage.restrictions.content) || !oProgram.usage.discretionaryFund.flag
                    || (oProgram.usage.discretionaryFund.flag === vm.choices['yes_no'].yes.code && !oProgram.usage.discretionaryFund.content)
                    || !oProgram.usage.loanTerms.flag || (oProgram.usage.loanTerms.flag === vm.choices['yes_no'].yes.code && !oProgram.usage.loanTerms.content)
                    || !oProgram.relatedPrograms.flag || (oProgram.relatedPrograms.flag === 'yes' && !oProgram.relatedPrograms.relatedTo) || !oProgram.projects.flag
                    || !oProgram.functionalCodes || oProgram.functionalCodes.length == 0 || !oProgram.subjectTerms || oProgram.subjectTerms.length == 0
                    || !oProgram.eligibility.applicant.types || oProgram.eligibility.applicant.types.length == 0
                    || !oProgram.eligibility.applicant.assistanceUsageTypes || oProgram.eligibility.applicant.assistanceUsageTypes.length == 0 || !oProgram.eligibility.applicant.additionalInfo
                    || !oProgram.eligibility.beneficiary.types || oProgram.eligibility.beneficiary.types.length == 0 || !oProgram.eligibility.beneficiary.additionalInfo.content
                    || !oProgram.eligibility.documentation.flag || (oProgram.eligibility.documentation.flag === 'yes' && !oProgram.eligibility.documentation.content)
                    || oProgram.eligibility.documentation.flag === 'yes' && !oProgram.eligibility.documentation.questions['OMBCircularA87'].flag
                    || !oProgram.preApplication.coordination.flag || (oProgram.preApplication.coordination.flag === 'yes' && !oProgram.preApplication.coordination.environmentalImpact.flag)
                    || (oProgram.preApplication.coordination.flag === 'yes' && !oProgram.preApplication.coordination.questions.ExecutiveOrder12372.flag) || !oProgram.application.procedures.questions.OMBCircularA102.flag
                    || !oProgram.award.procedures.content || !oProgram.application.deadlines.submission.flag || !oProgram.application.deadlines.approval.interval || !oProgram.application.deadlines.appeal.interval
                    || !oProgram.application.deadlines.renewal.interval || !oProgram.assistance.formula.flag || !oProgram.assistance.matching.flag || (oProgram.assistance.matching.flag == 'yes' && !oProgram.assistance.matching.percent)
                    || !oProgram.assistance.moe.flag || !oProgram.assistance.limitation.content || !oProgram.assistance.limitation.awarded || !oProgram.application.selectionCriteria.flag
                    || (oProgram.application.selectionCriteria.flag == 'yes' && !oProgram.application.selectionCriteria.content)
                    || !oProgram.postAward.reports.flag || (oProgram.postAward.reports.flag === 'yes' && !oProgram.postAward.reports.list.program.flag)
                    || (oProgram.postAward.reports.flag === 'yes' && !oProgram.postAward.reports.list.cash.flag) || (oProgram.postAward.reports.flag === 'yes' && !oProgram.postAward.reports.list.progress.flag)
                    || (oProgram.postAward.reports.flag === 'yes' && !oProgram.postAward.reports.list.expenditure.flag) || (oProgram.postAward.reports.flag === 'yes' && !oProgram.postAward.reports.list.performanceMonitoring.flag)
                    || !oProgram.postAward.audit.flag || (oProgram.postAward.audit.flag === 'yes' && !oProgram.postAward.audit.questions['OMBCircularA133'].flag)
                    || !oProgram.postAward.documents.flag || (oProgram.postAward.documents.flag === 'yes' && !oProgram.postAward.documents.content)
                    || !oProgram.financial.treasury.tafs || oProgram.financial.treasury.tafs.length == 0 || !oProgram.postAward.accomplishments.flag
                    || !oProgram.contacts['local'].flag || !oProgram.contacts.list || oProgram.contacts.list.length == 0);
                }

                /**
                 *
                 * @param Boolean saveProgram True -> Save Program then create publish request
                 * @param Object oProgram (using as variable in order to call this function out of edit page program)
                 * @returns Void
                 */
                function submitProgram(oProgram) {
                    var isProgramValidated = validateProgramFields(oProgram);

                    //Call save program on success then call showProgramChangeStatus
                    save(function () {
                        if (isProgramValidated) {
                            $scope.showProgramRequestModal(oProgram, 'program_submit');
                        } else {
                            //program has an issue and cannot be published yet
                            $location.hash('formErrorMessages');
                        }
                    });
                }


                //returns true if some required fields are missing.
                $scope.isVisible = function (sectionName) {
                    console.log("inside the isVisible function.. ");
                    console.log(sectionName);

                    var bool = checkMissingRequiredFields(sectionName);
                    console.log('are some required fields missing??: ' + bool);
                    return bool;

                };


                function checkMissingRequiredFields(sectionName) {
                    console.log("inside checkRequiredFieldsFilled");
                    if (sectionName === 'financialSection') {
                        console.log(vm.program);

                        //upper level validation
                        var requiredFieldsMissing = (!vm.program || !vm.program.financial || !vm.program.postAward
                        ||  !vm.program.financial.accounts || vm.program.financial.accounts.length == 0
                        || !vm.program.financial.treasury
                        || !vm.program.financial.treasury.tafs || vm.program.financial.treasury.tafs.length == 0
                        || !vm.program.postAward.accomplishments.flag);


                        //go into the arrays and check their elements also
                        var requiredFieldsMissing2 = false;
                        if (!requiredFieldsMissing) {
                            vm.program.financial.accounts.forEach(function (accountObj, index, array) {
                                console.log('accounts[' + index + '] = ', accountObj);
                                if (!accountObj.code) {
                                    requiredFieldsMissing2 = true;
                                    console.log("setting bool2 to true " + requiredFieldsMissing2);
                                }

                            });
                        }


                        console.log(requiredFieldsMissing + " " + requiredFieldsMissing2);
                        return requiredFieldsMissing || requiredFieldsMissing2;
                    }


                    return false;
                }


            }]);
})();
