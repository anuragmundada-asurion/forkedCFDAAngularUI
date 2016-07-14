!function() {
    'use strict';

    var myApp = angular.module('app');
    
    myApp
    .directive('federalHierarchyLabel', ['FederalHierarchyService', function(FederalHierarchyService) {
        return {

            scope: {
                "organizationId": "@"
            },
            link: function(scope, element, attributes) {
                attributes.$observe('organizationId', function(value){
                    if(value) {
                        //Call FederalHierarchy API and get Label of the organization
                        FederalHierarchyService.getFullLabelPathFederalHierarchyById(scope.organizationId, true, false, function (organizationNames) {
                            scope.organizationName = organizationNames;
                        }, function (error) {
                            scope.organizationNameError = true;
                            if (error['code'] == '404') {
                                scope.organizationName = "Organization Not Found";
                            } else {
                                scope.organizationName = "An error has occurred, Please try again !";
                            }
                        });
                    }
                });
            },
            template: '<img ng-show="!organizationName" style="max-width: 10%;" src="/img/img_cfda/loading.svg" /><div class="usa-alert usa-alert-error" role="alert" ng-if="organizationNameError"><div class="usa-alert-body"><h3 class="usa-alert-heading">Existing Agency Error</h3><p class="usa-alert-text">{{ organizationName | capitalize}}</p></div></div><span class="" ng-if="!organizationNameError">{{ organizationName | capitalize}}</span>'

        };
    }])
    .directive('federalHierarchyInputs', ['FederalHierarchyService', 'UserService', 'AuthorizationService', 'SUPPORTED_ROLES', function(FederalHierarchyService, UserService, AuthorizationService, SUPPORTED_ROLES){
        return {
            scope: {
                "noDefault": "=?",
                "organizationId": "=", // ngModel var passed by reference (two-way)
                "organizationConfiguration": "=?", // ngModel var passed by reference (two-way) optional
                "programCode": "=?", // ngModel var passed by reference (two-way) optional
                "hasDepartmentChanged": "=?",
                "hideDepartment": "=?",
                "renderOnOrgNull": "=?",
                "showAll": "=?", // e.g: for limited super user -> show all inputs
                "setDeptNullOnChange": "=?", //e.g for setting organizationId to null on setOrganizationId callback fn
                "setSelectedOption": "=?"
            },
            controller: ['$scope', '$filter', 'SUPPORTED_ROLES', 'ApiService', function($scope, $filter, SUPPORTED_ROLES, ApiService) {
                $scope.isControllerLoaded = false;

                /**
                 * function to call when the organizationId passed from directive is bound (edit mode ajax)
                 * @returns void
                 */
                $scope.initController = function() {
                    //store program organization id if the program has it otherwise store user's organization id
                    if(typeof $scope.programOrganizationId === 'undefined' ) {
                        $scope.programOrganizationId = (typeof $scope.organizationId === 'undefined' || $scope.organizationId === '' || $scope.organizationId === null) ? ($scope.noDefault ? null : UserService.getUserOrgId()) : $scope.organizationId;
                    }

                    $scope.isControllerLoaded = true;

                    //initialize hasDepartmentChanged to false at the beginning
                    $scope.hasDepartmentChanged = false;
                };

                /**
                 * Function to set the organizationId scope from dropdowns (Department/Agency/Office)
                 * @param string type
                 * @returns void
                 */
                $scope.setOrganizationId = function(type) {
                    switch(type){
                        case 'department':
                            if(typeof $scope.selectedDeptId !== 'undefined' && $scope.selectedDeptId !== ''
                                    && $scope.selectedDeptId !== null) {
                                $scope.organizationId = $scope.selectedDeptId;

                                //once user choose a different department, switch flag of hasDepartmentChanged
                                $scope.hasDepartmentChanged = true;
                            } else { //if department is not selected then set user's organization id
                                $scope.organizationId = $scope.programOrganizationId;
                            }

                            //empty agency & office dropdowns
                            $scope.dictionary.aAgency = [];
                            $scope.selectedAgencyId = null;
                            $scope.dictionary.aOffice = [];
                            $scope.selectedOfficeId = null;

                            if(typeof $scope.selectedDeptId !== 'undefined' && $scope.selectedDeptId !== ''
                                    && $scope.selectedDeptId !== null) {
                                //get agencies of the selected department
                                $scope.initDictionaries($scope.organizationId, true, true, function (oData) {
                                    if(oData.type === 'DEPARTMENT') {
                                        //initialize Department "Label" and Agency dropdown
                                        $scope.dictionary.aAgency = oData.hierarchy;
                                    }
                                });
                            }

                            //in case we need to set organizationId to null if department has not been selected
                            if(typeof $scope.setDeptNullOnChange !== 'undefined' && $scope.setDeptNullOnChange === true
                                    && ($scope.selectedDeptId === '' || typeof $scope.selectedDeptId === 'undefined')) {
                                $scope.organizationId = '';
                            }
                            break;
                        case 'agency':
                            if(typeof $scope.selectedAgencyId !== 'undefined' && $scope.selectedAgencyId !== ''
                                    && $scope.selectedAgencyId !== null) {
                                $scope.organizationId = $scope.selectedAgencyId;
                            } else { //if agency is not selected then set department
                                //if user is a root then set department from dropdown
                                if(AuthorizationService.authorizeByRole([SUPPORTED_ROLES.SUPER_USER]) || AuthorizationService.authorizeByRole([SUPPORTED_ROLES.RMO_SUPER_USER])) {
                                    $scope.organizationId = $scope.selectedDeptId;
                                } else if(AuthorizationService.authorizeByRole([SUPPORTED_ROLES.AGENCY_COORDINATOR])) { //if user is a agency coord then set department from user's
                                    $scope.organizationId = $scope.programOrganizationId;
                                }
                            }

                            //empty office dropdowns
                            $scope.dictionary.aOffice = [];
                            $scope.selectedOfficeId = null;

                            //get offices of the selected agency
                            $scope.initDictionaries($scope.organizationId, false, true, function (oData) {
                                if(oData.type === 'AGENCY') {
                                    //initialize Department "Label" and Office dropdown
                                    $scope.dictionary.aOffice = oData.hierarchy;
                                }
                            });
                            break;
                        case 'office':
                            if(typeof $scope.selectedOfficeId !== 'undefined' && $scope.selectedOfficeId !== ''
                                && $scope.selectedOfficeId !== null) {
                                $scope.organizationId = $scope.selectedOfficeId;
                            } else { //if office is not selected then set agency
                                $scope.organizationId = $scope.selectedAgencyId;
                            }
                            break;
                    }

                    //get federal hierarchy configuration
                    $scope.getFederalHierarchyConfiguration($scope.organizationId);

                    //get program code (first 2 digits)
                    $scope.getProgramCode($scope.organizationId, $scope.dictionary.aDepartment.concat($scope.dictionary.aAgency).concat($scope.dictionary.aOffice));

                    //change hasDeparmentChanged flag when we need to apply exception on showing inputs
                    if(typeof $scope.showAll !== 'undefined' && $scope.showAll === true &&
                        $scope.organizationId === $scope.programDepartmentId) {
                        //once user choose a different department, switch flag of hasDepartmentChanged
                        $scope.hasDepartmentChanged = false;
                    }
                };

                /**
                 * get program code (First 2 digits)
                 * @param String elementID
                 * @param Array aData
                 * @returns Void
                 */
                $scope.getProgramCode = function(elementID, aData){
                    do {
                        var aSelectedOrganization = $filter('filter')(aData, { "elementId": elementID }, true);
                        if($.isArray(aSelectedOrganization) && aSelectedOrganization.length === 1) {
                            if (aSelectedOrganization[0].cfdaCode) {
                                $scope.programCode = aSelectedOrganization[0].cfdaCode;
                            } else {
                                elementID = aSelectedOrganization[0].parentElementId;
                            }
                        } else {
                            $scope.programCode = '';
                            elementID = null;
                        }
                    } while(!$scope.programCode && elementID);
                };

                /**
                 * get federal hierarchy configuration
                 * @param String organizationId
                 * @returns void
                 */
                $scope.getFederalHierarchyConfiguration = function(organizationId) {
                    if(organizationId) {
                        var oApiParam = {
                            apiName: 'federalHierarchyConfiguration',
                            apiSuffix: '/'+organizationId,
                            oParams: {},
                            oData: {},
                            method: 'GET'
                        };

                        ApiService.call(oApiParam).then(function (data) {
                            $scope.organizationConfiguration = data;
                        }, function (error) {
                        });
                    }
                };

                /**
                 * function to use in order to load dictionaries
                 * @param string ordId
                 * @param boolean includeParent
                 * @param boolean includeChildren
                 * @param function fnCallbackSuccess
                 * @param function fnCallbackError
                 * @returns void
                 */
                $scope.initDictionaries = function(ordId, includeParent, includeChildren, fnCallbackSuccess, fnCallbackError){
                    //get Department level of user's organizationId
                    FederalHierarchyService.getFederalHierarchyById(ordId, includeParent, includeChildren, function (oData) {
                        if(typeof fnCallbackSuccess === 'function') {
                            fnCallbackSuccess(oData);
                        }
                    },
                    function(error){
                        $scope.error = "An error has occurred, Please try again !";

                        if(typeof fnCallbackError === 'function') {
                            fnCallbackError(error);
                        }
                    });
                };

                /**
                 * initialize Department/Agency/Office dropdowns (selected values)
                 * @param String userRole
                 * @returns void
                 */
                $scope.initFederalHierarchyDropdowns = function(userRole) {
                    //get current federal hierarchy by program organizationid or user organization id
                    $scope.initDictionaries($scope.programOrganizationId, true, true, function (oData) {
                        //get the department from the selected organization id if we need to apply exception on showing all input, e.g: hasDepartmentChanged
                        if(typeof $scope.showAll !== 'undefined' && $scope.showAll === true) {
                            $scope.programDepartmentId = oData.elementId;
                        }

                        //if role is agency coordinator, assign the department
                        if(userRole === SUPPORTED_ROLES.AGENCY_COORDINATOR) {
                            $scope.dictionary.aDepartment = [oData];
                            $scope.selectedDeptId = oData.elementId;

                            //lock dept up only if assigned orgId is this deptId
                            if(UserService.getUserOrgId() == oData.elementId) {
                                $scope.lockDept = true;
                            }
                        }

                        //if user is super admin -> set selected Department dropdown option
                        if(userRole === SUPPORTED_ROLES.SUPER_USER && oData.type === 'DEPARTMENT') {
                            $scope.selectedDeptId = oData.elementId;
                            //$scope.lockDept = true;
                        }

                        //if the program's organization id or user's organization id is different then department id -> fetch agencies/offices of that orgID
                        if($scope.programOrganizationId !== oData.elementId) {
                            //load agencies of the department Id
                            $scope.initDictionaries(oData.elementId, true, true, function (oDepartment) {
                                $scope.dictionary.aAgency = oDepartment.hierarchy;

                                //looping through agencies and verify if the programOrganizationId is actually an agency or an office
                                angular.forEach(oDepartment.hierarchy, function(oAgency) {
                                    //lockup select input only for AGENCY_COORDINATOR and if assigned orgId is this agencyId
                                    if(userRole === SUPPORTED_ROLES.AGENCY_COORDINATOR && UserService.getUserOrgId() == oAgency.elementId) {
                                        $scope.lockDept = true;
                                        $scope.lockAgency = true;
                                    }

                                    //check if $scope.programOrganizationId is an agency then set selected agency value and prepopulate offices of that agency
                                    if(oAgency.elementId == $scope.programOrganizationId) {
                                        $scope.selectedAgencyId = oAgency.elementId;

                                        if(oAgency.hasOwnProperty('hierarchy')) {
                                            $scope.dictionary.aOffice = oAgency.hierarchy;
                                        }

                                        //get program code (first 2 digits)
                                        $scope.getProgramCode($scope.programOrganizationId, $scope.dictionary.aAgency);
                                        return;
                                    }

                                    //check if this agency has offices, if yes,
                                    //loop through them and verify if $scope.programOrganizationId is an office if yes,
                                    //assign selected values for agency and office and also populate offices
                                    if(oAgency.hasOwnProperty('hierarchy')) {
                                        angular.forEach(oAgency.hierarchy, function(oOffice){
                                            //lockup select input only for AGENCY_COORDINATOR and if assigned orgId is this officeId
                                            if(userRole === SUPPORTED_ROLES.AGENCY_COORDINATOR && UserService.getUserOrgId() == oOffice.elementId) {
                                                $scope.lockDept = true;
                                                $scope.lockAgency = true;
                                                $scope.lockOffice = true;
                                            }

                                            if(oOffice.elementId == $scope.programOrganizationId) {
                                                $scope.selectedAgencyId = oAgency.elementId;
                                                $scope.selectedOfficeId = oOffice.elementId;
                                                $scope.dictionary.aOffice = oAgency.hierarchy;

                                                //get program code (first 2 digits)
                                                $scope.getProgramCode($scope.programOrganizationId, $scope.dictionary.aOffice);
                                                return;
                                            }
                                        });
                                    }
                                });

                                //check if we don't want to pre-set the option by default
                                if(typeof $scope.setSelectedOption !== 'undefined' && $scope.setSelectedOption === false) {
                                    $scope.selectedDeptId   = null;
                                    $scope.selectedAgencyId = null;
                                    $scope.selectedOfficeId = null;
                                    $scope.dictionary.aAgency = [];
                                    $scope.dictionary.aOffice = [];
                                    $scope.lockDept = false;
                                    $scope.lockAgency = false;
                                    $scope.lockOffice = false;
                                }
                            });
                        } else if($scope.programOrganizationId == oData.elementId) { //if the program's organization id or user's organization id is the same then prepopulate agencies
                            $scope.dictionary.aAgency = oData.hierarchy;

                            //get program code (first 2 digits)
                            $scope.getProgramCode($scope.programOrganizationId, $scope.dictionary.aDepartment);
                        }

                        //check if we don't want to pre-set the option by default
                        if(typeof $scope.setSelectedOption !== 'undefined' && $scope.setSelectedOption === false) {
                            $scope.selectedDeptId   = null;
                            $scope.selectedAgencyId = null;
                            $scope.selectedOfficeId = null;
                            $scope.dictionary.aAgency = [];
                            $scope.dictionary.aOffice = [];
                            $scope.lockDept = false;
                            $scope.lockAgency = false;
                            $scope.lockOffice = false;
                        }
                    });
                };
            }],
            link: function(scope, element, attributes) {
                scope.$watch('organizationId', function(value){
                    //execute this only at the begining (Once)
                    if((!scope.isControllerLoaded && typeof scope.renderOnOrgNull !== 'undefined' && scope.renderOnOrgNull === false && value) 
                        || (typeof scope.renderOnOrgNull === 'undefined' && !scope.isControllerLoaded)) {
                        //initialize controller
                        scope.initController();

                        scope.dictionary = {
                            aDepartment: [],
                            aAgency: [],
                            aOffice: []
                        };
                        scope.departmentLabel = '';
                        scope.error = '';

                        //get federal hierarchy configuration
                        scope.getFederalHierarchyConfiguration(scope.programOrganizationId);

                        //Case if user is an AGENCY USER
                        if(AuthorizationService.authorizeByRole([SUPPORTED_ROLES.AGENCY_USER, SUPPORTED_ROLES.OMB_ANALYST])) {
                            FederalHierarchyService.getFederalHierarchyById(scope.programOrganizationId, true, false, function (oData) {
                                scope.departmentLabel = FederalHierarchyService.getFullNameFederalHierarchy(oData);
                                scope.organizationId = scope.programOrganizationId;

                                //get program code (first 2 digits)
                                scope.getProgramCode(scope.organizationId, [oData]);
                            }, function (error) {
                                scope.error = "An error has occurred, Please try again !";
                            });
                        } //Case if user is an AGENCY COORDINATOR
                        else if(AuthorizationService.authorizeByRole([SUPPORTED_ROLES.AGENCY_COORDINATOR])) {
                            //initialize Department/Agency/Office dropdowns (selected values)
                            scope.initFederalHierarchyDropdowns(SUPPORTED_ROLES.AGENCY_COORDINATOR);

//                            //show department input as exception only for agency coordinator
//                            if(typeof scope.showDepartment !== 'undefined' && scope.showDepartment === true) {
//                                scope.initDictionaries('', true, false, function (oData) {
//                                    //initialize Department
//                                    scope.dictionary.aDepartment = oData._embedded.hierarchy;
//                                });
//                                //hide label Organization
//                                var $element = $(element[0]);
//                                $element.find('.departmen-label').hide();
//                            }
                        } //Case if user is ROOT or ROOT_RMO
                        else if(AuthorizationService.authorizeByRole([SUPPORTED_ROLES.SUPER_USER]) || AuthorizationService.authorizeByRole([SUPPORTED_ROLES.RMO_SUPER_USER])) {
                            //get Department level of user's organizationId
                            scope.initDictionaries('', true, false, function (oData) {
                                //initialize Department
                                scope.dictionary.aDepartment = oData._embedded.hierarchy;

                                //initialize Department/Agency/Office dropdowns (selected values)
                                scope.initFederalHierarchyDropdowns(SUPPORTED_ROLES.SUPER_USER);
                            });
                        }

                        /**
                         * CUSTOM FEATURES THAT OVERRIDE DEFAULT BEHAVIOR WRITTEN ABOVE
                         */

                        //hide department label
                        if(typeof scope.hideDepartment !== 'undefined' && scope.hideDepartment === true) {
                            FederalHierarchyService.getFederalHierarchyById(scope.programOrganizationId, true, false, function (oData) {
                                scope.departmentLabel = FederalHierarchyService.getFullNameFederalHierarchy(oData);
                                scope.organizationId = scope.programOrganizationId;
                            }, function (error) {
                                scope.error = "An error has occurred, Please try again !";
                            });
                        }

                        //Case if we need to show full inputs regardless roles
                        if(typeof scope.showAll !== 'undefined' && scope.showAll === true) {
                            //get Department level of user's organizationId
                            scope.initDictionaries('', true, false, function (oData) {
                                //initialize Department
                                scope.dictionary.aDepartment = oData._embedded.hierarchy;

                                //initialize Department/Agency/Office dropdowns (selected values)
                                scope.initFederalHierarchyDropdowns(SUPPORTED_ROLES.SUPER_USER);
                            });
                        }
                    }
                });
            },
            template:
                "<div class='organization-container'>"+
                    "<div class='usa-alert usa-alert-error' role='alert' ng-if='error'>" +
                      "<div class='usa-alert-body'>" +
                        "<h3 class='usa-alert-heading'>Agency Error</h3>" +
                        "<p class='usa-alert-text'>{{ error }}</p>" +
                      "</div>" +
                    "</div>" +
                    "<div class='no-input' ng-show='$root.hasRole([$root.SUPPORTED_ROLES.AGENCY_USER, $root.SUPPORTED_ROLES.OMB_ANALYST])'>"+
                        "{{ departmentLabel }}"+
                    "</div>"+
                    "<div class='usa-grid-full' ng-show='($root.hasRole([$root.SUPPORTED_ROLES.SUPER_USER,$root.SUPPORTED_ROLES.RMO_SUPER_USER,$root.SUPPORTED_ROLES.AGENCY_COORDINATOR]) || showAll === true)'>"+
                        "<div class='usa-width-one-third'>"+
                            "<label for='jqDepartmentFH'>Department</label>"+
                            "<select id='jqDepartmentFH' ng-disabled='($root.hasRole([$root.SUPPORTED_ROLES.AGENCY_COORDINATOR]) && lockDept === true) || dictionary.aDepartment.length == 0 || dictionary.aDepartment == null' name='department' ng-show='!hideDepartment' ng-change='setOrganizationId(\"department\")' ng-model='selectedDeptId' ng-options='item.elementId as item.name for item in dictionary.aDepartment' required>"+
                                "<option value=''>Please select a Department</option>"+
                            "</select>"+
                            "<span class='department-label2' ng-show='hideDepartment === true'> {{ departmentLabel }} </span>"+
                        "</div>"+
                        "<div class='usa-width-one-third'>"+
                            "<label for='jqAgencyFH'>Agency</label>"+
                            "<select id='jqAgencyFH' ng-disabled='($root.hasRole([$root.SUPPORTED_ROLES.AGENCY_COORDINATOR]) && lockAgency === true) || dictionary.aAgency.length == 0 || dictionary.aAgency == null' name='agency' ng-change='setOrganizationId(\"agency\")' ng-model='selectedAgencyId' ng-options='item.elementId as item.name for item in dictionary.aAgency'>"+
                                "<option value=''>Please select an Agency</option>"+
                            "</select>"+
                        "</div>"+
                        "<div class='usa-width-one-third'>"+
                            "<label for='jqOfficeFH'>Office</label>"+
                            "<select id='jqOfficeFH' ng-disabled='($root.hasRole([$root.SUPPORTED_ROLES.AGENCY_COORDINATOR]) && lockOffice === true) || dictionary.aOffice.length == 0 || dictionary.aOffice == null' name='office' ng-change='setOrganizationId(\"office\")' ng-model='selectedOfficeId' ng-options='item.elementId as item.name for item in dictionary.aOffice'>"+
                                "<option value=''>Please select an Office</option>"+
                            "</select>"+
                        "</div>"+
                    "</div>"+
                "</div>"
        };
    }]);
}();
