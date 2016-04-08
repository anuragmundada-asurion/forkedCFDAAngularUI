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
                            if (error['code'] == '404') {
                                scope.organizationName = "Organization Not Found";
                            } else {
                                scope.organizationName = "An error has occurred, Please try again !";
                            }
                        });
                    }
                });
            },
            template: '<img ng-show="!organizationName" style="max-width: 10%;" src="/img/img_cfda/loading.svg" />{{ organizationName }}'
        };
    }])
    .directive('federalHierarchyInputs', ['FederalHierarchyService', 'UserService', 'AuthorizationService', 'ROLES', function(FederalHierarchyService, UserService, AuthorizationService, ROLES){
        return {
            scope: {
                "organizationId": "=" // ngModel var passed by reference (two-way) 
            },
            controller: ['$scope', 'ROLES', function($scope, ROLES) {
                $scope.isControllerLoaded = false;

                /**
                 * function to call when the organizationId passed from directive is bound (edit mode ajax)
                 * @returns void
                 */
                $scope.initController = function() {
                    //store program organization id if the program has it otherwise store user's organization id
                    if(typeof $scope.programOrganizationId === 'undefined' ) {
                        $scope.programOrganizationId = (typeof $scope.organizationId === 'undefined' || $scope.organizationId === '' || $scope.organizationId === null) ? UserService.getUserOrgId() : $scope.organizationId;
                    }

                    $scope.isControllerLoaded = true;
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
                            break;
                        case 'agency':
                            if(typeof $scope.selectedAgencyId !== 'undefined' && $scope.selectedAgencyId !== '' 
                                    && $scope.selectedAgencyId !== null) {
                                $scope.organizationId = $scope.selectedAgencyId;
                            } else { //if agency is not selected then set department
                                //if user is a root then set department from dropdown
                                if(AuthorizationService.authorizeByRole([ROLES.SUPER_USER])) {
                                    $scope.organizationId = $scope.selectedDeptId;
                                } else if(AuthorizationService.authorizeByRole([ROLES.AGENCY_COORDINATOR])) { //if user is a agency coord then set department from user's
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
                        //if role is agency coordinator, assign the department
                        if(userRole === ROLES.AGENCY_COORDINATOR.iamRoleId) {
                            $scope.dictionary.aDepartment = [oData];
                        }

                        //if user is super admin -> set selected Department dropdown option
                        if(userRole === ROLES.SUPER_USER.iamRoleId && oData.type === 'DEPARTMENT') {
                            $scope.selectedDeptId = oData.elementId;
                        }

                        //if the program's organization id or user's organization id is different then department id -> fetch agencies/offices of that orgID
                        if($scope.programOrganizationId !== oData.elementId) {
                            //load agencies of the department Id
                            $scope.initDictionaries(oData.elementId, true, true, function (oDepartment) {
                                $scope.dictionary.aAgency = oDepartment.hierarchy;

                                //looping through agencies and verify if the programOrganizationId is actually an agency or an office
                                angular.forEach(oDepartment.hierarchy, function(oAgency) {
                                    //check if $scope.programOrganizationId is an agency then set selected agency value and prepopulate offices of that agency
                                    if(oAgency.elementId == $scope.programOrganizationId) {
                                        $scope.selectedAgencyId = oAgency.elementId;
                                        if(oAgency.hasOwnProperty('hierarchy')) {
                                            $scope.dictionary.aOffice = oAgency.hierarchy;
                                        }
                                        return;
                                    }

                                    //check if this agency has offices, if yes, 
                                    //loop through them and verify if $scope.programOrganizationId is an office if yes,
                                    //assign selected values for agency and office and also populate offices
                                    if(oAgency.hasOwnProperty('hierarchy')) {
                                        angular.forEach(oAgency.hierarchy, function(oOffice){
                                            if(oOffice.elementId == $scope.programOrganizationId) {
                                                $scope.selectedAgencyId = oAgency.elementId;
                                                $scope.selectedOfficeId = oOffice.elementId;
                                                $scope.dictionary.aOffice = oAgency.hierarchy;
                                                return;
                                            }
                                        });
                                    }
                                });
                            });
                        } else if($scope.programOrganizationId == oData.elementId) { //if the program's organization id or user's organization id is the same then prepopulate agencies
                            $scope.dictionary.aAgency = oData.hierarchy;
                        }
                    });
                };
            }],
            link: function(scope, element, attributes) {
                scope.$watch('organizationId', function(value){
                    //execute this only at the begining (Once)
                    if(value && !scope.isControllerLoaded) {
                        //initialize controller
                        scope.initController();

                        scope.dictionary = {
                            aDepartment: [],
                            aAgency: [],
                            aOffice: []
                        };
                        scope.departmentLabel = '';
                        scope.error = '';

                        //Case if user is an AGENCY USER
                        if(AuthorizationService.authorizeByRole([ROLES.AGENCY_USER])) {
                            FederalHierarchyService.getFullLabelPathFederalHierarchyById(scope.programOrganizationId, true, false, function (organizationNames) {
                                scope.departmentLabel = organizationNames;
                                scope.organizationId = scope.programOrganizationId;
                            }, function (error) {
                                scope.error = "An error has occurred, Please try again !";
                            });
                        } //Case if user is an AGENCY COORDINATOR
                        else if(AuthorizationService.authorizeByRole([ROLES.AGENCY_COORDINATOR])) {
                            //initialize Department/Agency/Office dropdowns (selected values)
                            scope.initFederalHierarchyDropdowns(ROLES.AGENCY_COORDINATOR.iamRoleId);
                        } //Case if user is ROOT
                        else if(AuthorizationService.authorizeByRole([ROLES.SUPER_USER])) {
                            //get Department level of user's organizationId
                            scope.initDictionaries('', true, false, function (oData) {
                                //initialize Department
                                scope.dictionary.aDepartment = oData._embedded.hierarchy;

                                //initialize Department/Agency/Office dropdowns (selected values)
                                scope.initFederalHierarchyDropdowns(ROLES.SUPER_USER.iamRoleId);
                            });
                        }
                    }
                });
            },
            template: 
                "<div class='organization-container'>"+
                    "<div class='no-input' has-role='["+JSON.stringify(ROLES.AGENCY_USER)+"]'>"+
                        "{{ departmentLabel }}"+
                    "</div>"+
                    "<div class='organization-container-form' has-role='["+JSON.stringify(ROLES.SUPER_USER)+","+ JSON.stringify(ROLES.AGENCY_COORDINATOR)+"]'>"+
                        "<div class='input-field usa-width-one-fourth'>"+
                            "<h3><label for='jqDepartmentFH'>Department</label></h3>"+
                            "<select id='jqDepartmentFH' name='department' class='usa-form-medium' has-role='["+JSON.stringify(ROLES.SUPER_USER)+"]' ng-change='setOrganizationId(\"department\")' ng-model='selectedDeptId' ng-options='item.elementId as item.name for item in dictionary.aDepartment' required>"+
                                "<option value=''>Please select a Department</option>"+
                            "</select>"+
                            "<span class='departmen-label' has-role='["+JSON.stringify(ROLES.AGENCY_COORDINATOR)+"]'> {{ dictionary.aDepartment[0].name }} </span>"+
                        "</div>"+
                        "<div class='input-field usa-width-one-fourth'>"+
                            "<h3><label for='jqAgencyFH'>Agency</label></h3>"+
                            "<select id='jqAgencyFH' name='agency' class='usa-form-medium' ng-change='setOrganizationId(\"agency\")' ng-model='selectedAgencyId' ng-options='item.elementId as item.name for item in dictionary.aAgency'>"+
                                "<option value=''>Please select an Agency</option>"+
                            "</select>"+

                        "</div>"+
                        "<div class='input-field usa-width-one-fourth'>"+
                            "<h3><label for='jqOfficeFH'>Office</label></h3>"+
                            "<select id='jqOfficeFH' name='office' class='usa-form-medium' ng-change='setOrganizationId(\"office\")' ng-model='selectedOfficeId' ng-options='item.elementId as item.name for item in dictionary.aOffice'>"+
                                "<option value=''>Please select an Office</option>"+
                            "</select>"+

                        "</div>"+
                    "</div>"+
                    "{{ error }}"+
                "</div>"
        };
    }]);
}();
