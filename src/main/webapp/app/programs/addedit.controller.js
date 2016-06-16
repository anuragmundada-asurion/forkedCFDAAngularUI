(function () {
    "use strict";

    angular
        .module('app')
        .controller('AddEditProgram',
        ['$stateParams', '$scope', '$location', '$state', '$filter', '$parse', '$http','PERMISSIONS', '$log', 'ngDialog', 'ApiService', 'util', 'appUtil', 'appConstants', 'Dictionary', 'ProgramFactory', 'Contact', 'UserService', 'AuthorizationService', 'DictionaryService', 'ROLES',
            function ($stateParams, $scope, $location, $state, $filter, $parse, $http, PERMISSIONS, $log, ngDialog, ApiService, util, appUtil, appConstants, Dictionary, ProgramFactory, Contacts, UserService, AuthorizationService, DictionaryService,ROLES) {

                $scope.$log = $log;

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

                $scope.instructionalText = {};
                //initialize dictionary container
                $scope.dictionary = {};

                /**
                 * load dictionary
                 * @param Object oProgram
                 * @returns Void
                 */
                $scope.loadDictionaries = function (oProgram) {
                    Dictionary.query({ids: TREES.join(',')}, function (data) {
                        //Functional Code (async -> for edit mode set pre-selected one)
                        $scope.dictionary.aFunctionalCode = DictionaryService.istevenDropdownDataStructure(data.functional_codes, (oProgram) ? oProgram.functionalCodes : [], true);

                        //Applicant Eligibility
                        $scope.dictionary.aApplicantEligibility = DictionaryService.istevenDropdownDataStructure(data.applicant_types, (oProgram) ? oProgram.eligibility.applicant.types : [], false);

                        //Beneficiary Eligibility
                        $scope.dictionary.aBeneficiaryEligibility = DictionaryService.istevenDropdownDataStructure(data.beneficiary_types, (oProgram) ? oProgram.eligibility.beneficiary.types : [], false);

                        //Use of Assistance
                        $scope.dictionary.aAssistanceUsageType = DictionaryService.istevenDropdownDataStructure(data.assistance_usage_types, (oProgram) ? oProgram.eligibility.applicant.assistanceUsageTypes : [], false);

                        //Assistance type
                        $scope.dictionary.aAssistanceType = DictionaryService.istevenDropdownDataStructure(data.assistance_type, (oProgram) ? oProgram.assistanceTypes : [], true);
                    });
                };

                /**
                 * unselect dictionary from dictionary scope
                 * @param Object oItem
                 * @param String dictionaryName
                 * @returns void
                 */
                $scope.unselectDictionary = function (oItemRemove, dictionaryName) {
                    if ($scope.dictionary[dictionaryName]) {
                        angular.forEach($scope.dictionary[dictionaryName], function (oItem, i) {
                            if (oItem.element_id == oItemRemove.element_id) {
                                $scope.dictionary[dictionaryName][i].ticked = false;
                            }
                        });
                    }
                };

                //initialize program object
                loadInstructionalText();
                if ($state.current['name'] === 'addProgram') { // Create Program
                    //vm.isCreateProgram = true;
                    vm.program = new ProgramFactory();
                    vm.program._id = null;
                    //pre-set program's organization id by user's organization id
                    vm.program.organizationId = UserService.getUserOrgId();

                    //load dictionaries
                    $scope.loadDictionaries();

                } else { // Edit/Review program
                    //vm.isCreateProgram = false;
                    vm.program = {};
                    ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                        vm.program = data;
                        vm.originalTitle = vm.program.title;

                        //load dictionaries
                        $scope.loadDictionaries(vm.program);

                        //reload contacts when object is available
                        vm.choices.contacts = Contacts.query({agencyId: vm.program.organizationId});

                        if (vm.program.status === 'Pending') {
                            var oApiParam = {
                                apiName: 'programRequest',
                                apiSuffix: '',
                                oParams: {
                                    completed: false,
                                    program: vm.program._id,
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
                        } else if (vm.program.status === 'Draft') {
                            //remove first 2 digits (Program Code) from ProgramNumber
                            if (vm.program.programNumber && vm.program.programNumber.indexOf('.') !== -1) {
                                vm.programCode = vm.program.programNumber.split('.')[0];
                                vm.program.programNumber = vm.program.programNumber.split('.')[1];
                            }
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
                        programs: ProgramFactory.query({limit: 2500, status: 'published'}),
                        contacts: vm.program.organizationId ? Contacts.query({agencyId: vm.program.organizationId}) : Contacts.query({agencyId: UserService.getUser().orgId}),
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
                    getDictionary: getDictionary,
                    verifyProgramNumber: verifyProgramNumber,
                    getAuthorizationTitle: appUtil.getAuthorizationTitle,
                    getAmendmentTitle: appUtil.getAuthorizationTitle,
                    getAccountTitle: appUtil.getAccountTitle,
                    getObligationTitle: appUtil.getObligationTitle,
                    getTafsTitle: appUtil.getTafsTitle,
                    getDeadlineTitle: appUtil.getDeadlineTitle,
                    getContactTitle: appUtil.getContactTitle,
                    nextId: util.nextId,
                    shouldSeeCoordinatorMessage: shouldSeeCoordinatorMessage
                });

                Dictionary.toDropdown({ids: appConstants.CORE_DICTIONARIES.join(',')}).$promise.then(function (data) {
                    angular.extend(vm.choices, data);
                });

                Dictionary.toDropdown({ids: DICTIONARIES.join(',')}).$promise.then(function (data) {
                    angular.extend(vm.choices, data);
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

                    //apply cleaning data for isteven dropdown selected data structure
                    var oDictionaryApplicantEligibilityIDs = DictionaryService.istevenDropdownGetIds(vm.program.eligibility.applicant, ['types', 'assistanceUsageTypes']);

                    copy.functionalCodes = DictionaryService.istevenDropdownGetIds(vm.program, ['functionalCodes']).functionalCodes;
                    copy.eligibility.applicant.types = oDictionaryApplicantEligibilityIDs.types;
                    copy.eligibility.applicant.assistanceUsageTypes = oDictionaryApplicantEligibilityIDs.assistanceUsageTypes;
                    copy.eligibility.beneficiary.types = DictionaryService.istevenDropdownGetIds(vm.program.eligibility.beneficiary, ['types']).types;
                    copy.assistanceTypes = DictionaryService.istevenDropdownGetIds(vm.program, ['assistanceTypes']).assistanceTypes;
                    if (copy.financial && copy.financial.hasOwnProperty('obligations')) {
                        angular.forEach(copy.financial.obligations, function (row, i) {
                            if (row && row.hasOwnProperty('assistanceType') && !angular.isUndefinedOrNull(row.assistanceType)) {
                                if (typeof row.assistanceType === 'object') {
                                    copy.financial.obligations[i].assistanceType = DictionaryService.istevenDropdownGetIds(row, ['assistanceType']).assistanceType[0];
                                }
                            }
                        });
                    }

                    if (!copy._id || !copy.status) {
                        copy.status = "Draft";
                    }

                    //Prepend 2 digits (ProgramCode) to programNumber
                    if (copy.status === 'Draft' && vm.organizationConfiguration && !vm.organizationConfiguration.programNumberAuto) {
                        copy.programNumber = vm.programCode + '.' + ((typeof copy.programNumber !== 'undefined') ? copy.programNumber : '');
                    } else if (vm.organizationConfiguration && vm.organizationConfiguration.programNumberAuto) {
                        //clear out program number if organization's number is auto generated
                        copy.programNumber = '';
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
                    //isteven data structure
                    if (angular.isArray(value) && value.length > 0) {
                        value = value[0];
                    }
                    if (typeof value === 'object') {
                        value = value.element_id;
                    }
                    //end isteven structure

                    var selected = vm.filters.traverseTree([value], $scope.dictionary[dictionaryName], {
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
                    return !(checkMissingRequiredFields('financialSection') || checkMissingRequiredFields('contactSection')
                        || !oProgram.title || !oProgram.authorizations || oProgram.authorizations.length == 0
                        || !oProgram.objective || !oProgram.usage.restrictions.flag
                        || (oProgram.usage.restrictions.flag === vm.choices['yes_no'].yes.code && !oProgram.usage.restrictions.content) || !oProgram.usage.discretionaryFund.flag
                        || (oProgram.usage.discretionaryFund.flag === vm.choices['yes_no'].yes.code && !oProgram.usage.discretionaryFund.content)
                        || !oProgram.usage.loanTerms.flag || (oProgram.usage.loanTerms.flag === vm.choices['yes_no'].yes.code && !oProgram.usage.loanTerms.content)
                        || !oProgram.relatedPrograms.flag || (oProgram.relatedPrograms.flag === 'yes' && !oProgram.relatedPrograms.relatedTo) || !oProgram.projects.flag
                        || !oProgram.functionalCodes || oProgram.functionalCodes.length == 0 || !oProgram.subjectTerms || oProgram.subjectTerms.length == 0
                        || !oProgram.assistanceTypes || oProgram.assistanceTypes.length == 0
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
                        || !oProgram.contacts['local'].flag || !oProgram.contacts.list || oProgram.contacts.list.length == 0
                        || checkMissingRequiredFields('ProgramNumber')
                        || (vm.organizationConfiguration && vm.organizationConfiguration.programNumberAuto === false && vm.isProgramNumberUnique === false)
                    );
                }


                $scope.isNextAvailableProgramNumberOutsideRange = function (callback) {
                    var oApiParam = {
                        apiName: 'nextAvailableProgramNumber',
                        apiSuffix: '',
                        oParams: {
                            organizationId: vm.program.organizationId
                        },
                        oData: {},
                        method: 'GET'
                    };

                    //Call API get next available program number
                    ApiService.call(oApiParam).then(
                        function (data) {
                            callback(data);
                        },
                        function (error) {
                            console.log(error);
                        });
                };

                function showWarning(oProgram) {
                    var msg1 = "There are no more available numbers in the configured range. If you would like to continue, the next " +
                        "available number will be assigned, but will fall outside of the configured range for this organization." + "<br>" +
                        " If you do not want to continue, please adjust the number range for your" +
                        " organization before proceeding and your Federal Assistance Listing will remain in a Draft state.";
                    var msg2 = "There are no more available numbers in the configured range. Please contact your agency coordinator and have" +
                        " them adjust your organizations number range.";
                    var template = '<div class="usa-alert usa-alert-warning usa-margin-bottom-2" role="alert">' +
                        '<div class="usa-alert-body">' +
                        '<p class="usa-alert-text">' +
                        '<span has-access="{{ [PERMISSIONS.CAN_REQUEST_SUBMISSION_OUTSIDE_RANGE] }}">' + msg1 + '</span>' +
                        '<span has-role="{{ [ROLES.AGENCY_USER] }}">' + msg2 + '</span>' +
                        '</p>' +
                        '</div>' +
                        '</div>' +
                        '<button class="usa-button-gray-light" ui-sref="programList" ng-click="closeModal();">Cancel</button>' +
                        '<button has-access="{{ [PERMISSIONS.CAN_REQUEST_SUBMISSION_OUTSIDE_RANGE] }}" ng-click="openSubmitModal();">Continue</button>';


                    ngDialog.open({
                        template: template,
                        className: 'ngdialog-theme-cfda',
                        plain: true,
                        closeByEscape: true,
                        showClose: true,
                        scope: $scope, //give the dialog access to current scope
                        width: '80%'
                    });
                }

                $scope.openSubmitModal = function () {
                    $scope.closeModal();//close current modal
                    $scope.showProgramRequestModal(vm.program, 'program_submit');//show submit Program  dialog modal
                };

                /**
                 *
                 * @param oProgram Object (using as variable in order to call this function out of edit page program)
                 * @returns Void
                 */
                function submitProgram(oProgram) {
                    var isProgramValidated = validateProgramFields(oProgram);

                    save(function () {
                        if (isProgramValidated) {
                            //verify if program's organization is auto
                            if (vm.organizationConfiguration && vm.organizationConfiguration.programNumberAuto) {

                                //check if programNumber is outside of range, (when configuration is auto)
                                $scope.isNextAvailableProgramNumberOutsideRange(function (oData) {
                                    var isNumberOutsideRange = (oData.hasOwnProperty('isProgramNumberOutsideRange') ? oData['isProgramNumberOutsideRange'] : true);

                                    if (isNumberOutsideRange) {
                                        showWarning(oProgram);//will allow agency coordinator to go ahead and submit.
                                    } else {
                                        $scope.showProgramRequestModal(oProgram, 'program_submit');
                                    }
                                });
                                // verify if program's organization is manual
                            } else if (vm.organizationConfiguration && !vm.organizationConfiguration.programNumberAuto) {
                                //Call save program on success then call showProgramChangeStatus
                                $scope.showProgramRequestModal(oProgram, 'program_submit');
                            }
                        } else {
                            //program has an issue and cannot be published yet
                            $location.hash('formErrorMessages');
                        }
                    });
                }

                //returns true if some required fields are missing.
                $scope.requiredFieldsMissing = function (sectionName) {
                    return checkMissingRequiredFields(sectionName);
                };


                function checkMissingRequiredFields(sectionName) {
                    var requiredFieldsMissing = false;
                    switch (sectionName) {
                        case 'financialSection':
                            //upper level validation
                            requiredFieldsMissing = (!vm.program || !vm.program.financial || !vm.program.postAward
                            || !vm.program.financial.accounts || vm.program.financial.accounts.length == 0
                            || !vm.program.financial.obligations || vm.program.financial.obligations.length == 0
                            || !vm.program.financial.treasury || !vm.program.financial.treasury.tafs || vm.program.financial.treasury.tafs.length == 0
                            || (vm.program.postAward.hasOwnProperty("accomplishments") && !vm.program.postAward.accomplishments.flag));


                            //go into the arrays and check their elements also
                            if (!requiredFieldsMissing) {

                                //check things in accounts array
                                vm.program.financial.accounts.forEach(function (account, index, array) {
                                    if (!account.code || !$scope.validateFieldByRegex('^[0-9\-\_]*$', account.code)) {
                                        requiredFieldsMissing = true;
                                    }
                                });

                                //check things in obligations array
                                vm.program.financial.obligations.forEach(function (obligation, index, array) {
                                    if (!obligation.questions) {
                                        requiredFieldsMissing = true;
                                    } else {
                                        if (!obligation.questions.recovery) {
                                            requiredFieldsMissing = true;
                                        }
                                        if (!obligation.questions.salary_or_expense) {
                                            requiredFieldsMissing = true;
                                        }
                                        //assistance type validation
                                        if (obligation.questions.salary_or_expense.flag == 'na' && (!obligation.assistanceType || obligation.assistanceType == '')) {
                                            requiredFieldsMissing = true;
                                        }
                                        //validations for correct pfy, cfy, bfy dollar amount formats, (numbers and commas only)
                                        angular.forEach(obligation.values, function(fiscalYear){
                                            if(fiscalYear.hasOwnProperty("actual") && !$scope.validateFieldByRegex('^[0-9\,]*$', fiscalYear.actual)){
                                                requiredFieldsMissing = true;
                                            }
                                            if(fiscalYear.hasOwnProperty("estimate") && !$scope.validateFieldByRegex('^[0-9\,]*$', fiscalYear.estimate)){
                                                requiredFieldsMissing = true;
                                            }
                                        });
                                    }
                                });


                                //check things in tafs array
                                vm.program.financial.treasury.tafs.forEach(function (taf, index, array) {
                                    if (!taf.departmentCode) {
                                        requiredFieldsMissing = true;
                                    }
                                    if (!taf.accountCode) {
                                        requiredFieldsMissing = true;
                                    }
                                });

                            }
                            return requiredFieldsMissing;
                        case 'contactSection':

                            requiredFieldsMissing = (!vm.program.contacts || (typeof vm.program.contacts['local'] !== 'undefined' && !vm.program.contacts['local'].flag) || !vm.program.contacts.list || vm.program.contacts.list.length == 0);

                            //if still false, then check hq address's required fields;
                            if (!requiredFieldsMissing) {

                                vm.program.contacts.list.forEach(function (hqContact, index, array) {

                                    requiredFieldsMissing = !(hqContact.fullName && hqContact.email && hqContact.phone
                                    && hqContact.address && hqContact.city && hqContact.zip && hqContact.state);

                                    if(!$scope.validateFieldByRegex('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$', hqContact.email)){
                                        debugger;
                                        requiredFieldsMissing = true;
                                    }

                                });

                                if(!$scope.validateFieldByRegex('(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?', vm.program.website)){
                                    requiredFieldsMissing = true;
                                }

                            }
                            return requiredFieldsMissing;

                        case 'ProgramNumber':
                            return (vm.organizationConfiguration && vm.organizationConfiguration.programNumberAuto === false && !(((vm.program.programNumber >= vm.organizationConfiguration.programNumberLow && vm.program.programNumber <= vm.organizationConfiguration.programNumberHigh) || AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_SUBMISSION_OUTSIDE_RANGE) ) && vm.program.programNumber.length === 3));
                    }


                    return false;
                }

                function getDictionary(name, aSelectedIDs) {
                    var aDictionary = [];
                    if (angular.isArray(aSelectedIDs) && aSelectedIDs.length > 0 && $scope.dictionary.hasOwnProperty(name)) {
                        aDictionary = DictionaryService.istevenDropdownDataStructure($scope.dictionary[name], aSelectedIDs, false);
                    } else if ($scope.dictionary.hasOwnProperty(name)) {
                        aDictionary = $scope.dictionary[name];
                    }

                    return aDictionary;
                }

                function verifyProgramNumber() {
                    //no alpha allowed in program number,
                    if (vm.program.programNumber) {
                        vm.program.programNumber = vm.program.programNumber.replace(/[^0-9]/g, '');
                    }

                    //after alphas removed, verify number
                    if (vm.organizationConfiguration && !vm.organizationConfiguration.programNumberAuto && vm.programCode && typeof vm.program.programNumber !== 'undefined' && vm.program.programNumber.length === 3) {

                        //provided program number is within the range
                        if (vm.program.programNumber < vm.organizationConfiguration.programNumberLow || vm.program.programNumber > vm.organizationConfiguration.programNumberHigh) {
                            vm.isProgramNumberOutsideRange = true;
                        } else {
                            vm.isProgramNumberOutsideRange = false;
                        }

                        // check if user has access to perform check on FAL outside the range
                        if ((vm.isProgramNumberOutsideRange === true && AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_SUBMISSION_OUTSIDE_RANGE)) || vm.isProgramNumberOutsideRange === false) {
                            //verify program number uniqueness
                            var oApiParam = {
                                apiName: 'programNumberUnique',
                                apiSuffix: '',
                                oParams: {
                                    programNumber: vm.programCode + '.' + vm.program.programNumber,
                                    id: vm.program._id
                                },
                                oData: {},
                                method: 'GET'
                            };

                            ApiService.call(oApiParam).then(function (data) {
                                vm.isProgramNumberUnique = data.isProgramNumberUnique;
                            }, function (error) {
                                vm.isProgramNumberUnique = false;
                                console.log(error);
                            });
                        }
                    }
                    else {
                        vm.isProgramNumberUnique = true;
                        //provided program number is between the range
                        vm.isProgramNumberOutsideRange = false;
                    }
                }


                function shouldSeeCoordinatorMessage() {
                    if (AuthorizationService.authorizeByRole([ROLES.SUPER_USER, ROLES.AGENCY_COORDINATOR])){
                        return false;
                    }
                    return true;
                }


                function loadInstructionalText(){
                    $http.get('/data/instructionalText.json').success(function(data) {
                       $scope.instructionalText = data;
                       vm.instructionalText = data;
                       //console.log(data);
                    });
                }


                //returns false if error, true if no error. may clean up the code later, and put this in validation service
                $scope.validateFieldByRegex = function(regexPattern, field) {
                    var regexObj = new RegExp(regexPattern);
                    if(regexObj.test(field)){
                        return true;
                    }
                    return false;
                };

                $scope.getActualOrEstimate = function(obligationValueObj){
                    if(obligationValueObj.hasOwnProperty('actual')){
                        return {label: "actual", dollarValue: obligationValueObj.actual};
                    }
                    if(obligationValueObj.hasOwnProperty('estimate')){
                        return {label: "estimate", dollarValue: obligationValueObj.estimate};
                    }
                    return {label: "no-estimate-or-actual", dollarValue: "000000"};
                }


            }]);
})();
