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
            controller: ['$scope', function($scope) {
                /**
                 * Function to set the organizationId scope from dropdowns (Department/Agency/Office)
                 * @param string type
                 * @returns void
                 */
                $scope.setOrganizationId = function(type) {
                    switch(type){
                        case 'department':
                            if(typeof $scope.selectedDeptId !== 'undefined' && $scope.selectedDeptId !== '' 
                                    && $scope.selectedDeptId !== null && $scope.selectedDeptId.hasOwnProperty('elementId')) {
                                $scope.organizationId = $scope.selectedDeptId.elementId;
                            } else { //if department is not selected then set user's organization id
                                $scope.organizationId = UserService.getUserOrgId();
                            }

                            //empty agency & office dropdowns
                            $scope.dictionary.aAgency = [];
                            $scope.selectedAgencyId = null;
                            $scope.dictionary.aOffice = [];
                            $scope.selectedOfficeId = null;

                            //get agencies of the selected department
                            $scope.initDictionaries($scope.organizationId, true, true, function (oData) {
                                if(oData.type === 'DEPARTMENT') {
                                    //initialize Department "Label" and Agency dropdown
                                    $scope.dictionary.aAgency = oData.hierarchy;
                                }
                            });
                            break;
                        case 'agency':
                            if(typeof $scope.selectedAgencyId !== 'undefined' && $scope.selectedAgencyId !== '' 
                                    && $scope.selectedAgencyId !== null && $scope.selectedAgencyId.hasOwnProperty('elementId')) {
                                $scope.organizationId = $scope.selectedAgencyId.elementId;
                            } else { //if agency is not selected then set department
                                //if user is a root then set department from dropdown
                                if(AuthorizationService.authorizeByRole([ROLES.SUPER_USER])) {
                                    $scope.organizationId = $scope.selectedDeptId.elementId;
                                } else if(AuthorizationService.authorizeByRole([ROLES.AGENCY_COORDINATOR])) { //if user is a agency coord then set department from user's
                                    $scope.organizationId = UserService.getUserOrgId();
                                }
                            }

                            //empty office dropdowns
                            $scope.dictionary.aOffice = [];
                            $scope.selectedOfficeId = null;

                            //get offices of the selected agency
                            $scope.initDictionaries($scope.organizationId, false, true, function (oData) {
                                if(oData.type === 'AGENCY') {
                                    //initialize Department "Label" and Agency dropdown
                                    $scope.dictionary.aOffice = oData.hierarchy;
                                }
                            });
                            break;
                        case 'office':
                            if(typeof $scope.selectedOfficeId !== 'undefined' && $scope.selectedOfficeId !== '' 
                                && $scope.selectedOfficeId !== null && $scope.selectedOfficeId.hasOwnProperty('elementId')) {
                                $scope.organizationId = $scope.selectedOfficeId.elementId;
                            } else { //if office is not selected then set agency
                                $scope.organizationId = $scope.selectedAgencyId.elementId;
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
            }],
            link: function(scope, element, attributes) {
                scope.dictionary = {
                    aDepartment: [],
                    aAgency: [],
                    aOffice: []
                };
                scope.departmentLabel = '';
                scope.error = '';

                //Case if user is an AGENCY USER
                if(AuthorizationService.authorizeByRole([ROLES.AGENCY_USER])) {
                    FederalHierarchyService.getFullLabelPathFederalHierarchyById(UserService.getUserOrgId(), true, false, function (organizationNames) {
                        scope.departmentLabel = organizationNames;
                        scope.organizationId = UserService.getUserOrgId();
                    }, function (error) {
                        scope.error = "An error has occurred, Please try again !";
                    });
                } //Case if user is an AGENCY COORDINATOR
                else if(AuthorizationService.authorizeByRole([ROLES.AGENCY_COORDINATOR])) {
                    //get Department level of user's organizationId
                    scope.initDictionaries(UserService.getUserOrgId(), true, true, function (oData) {
                        if(oData.type === 'DEPARTMENT') {
                            //initialize Department "Label" and Agency dropdown
                            scope.dictionary = {
                                aDepartment: [oData],
                                aAgency: oData.hierarchy,
                                aOffice: []
                            };
                        }
                    });
                } //Case if user is ROOT
                else if(AuthorizationService.authorizeByRole([ROLES.SUPER_USER])) {
                    //get Department level of user's organizationId
                    scope.initDictionaries('', true, false, function (oData) {
                        //initialize Department "Label" and Agency dropdown
                        scope.dictionary = {
                            aDepartment: oData._embedded.hierarchy,
                            aAgency: [],
                            aOffice: []
                        };
                    });
                }
            },
            template: 
                "<div class='organization-container'>"+
                    "<div class='no-input' has-role='["+JSON.stringify(ROLES.AGENCY_USER)+"]'>"+
                        "{{ departmentLabel }}"+
                    "</div>"+
                    "<div class='organization-container-form' has-role='["+JSON.stringify(ROLES.SUPER_USER)+","+ JSON.stringify(ROLES.AGENCY_COORDINATOR)+"]'>"+
                        "<div class='input-field usa-width-one-fourth'>"+
                            "<h3><label for='jqDepartmentFH'>Department</label></h3>"+
                            "<select id='jqDepartmentFH' name='department' class='usa-form-medium' has-role='["+JSON.stringify(ROLES.SUPER_USER)+"]' ng-change='setOrganizationId(\"department\")' ng-model='selectedDeptId' ng-options='item.name for item in dictionary.aDepartment track by item.elementId' required>"+
                                "<option value=''>Please select a Department</option>"+
                            "</select>"+
                            "<span class='departmen-label' has-role='["+JSON.stringify(ROLES.AGENCY_COORDINATOR)+"]'> {{ dictionary.aDepartment[0].name }} </span>"+
                        "</div>"+
                        "<div class='input-field usa-width-one-fourth'>"+
                            "<h3><label for='jqAgencyFH'>Agency</label></h3>"+
                            "<select id='jqAgencyFH' name='agency' class='usa-form-medium' ng-change='setOrganizationId(\"agency\")' ng-model='selectedAgencyId' ng-options='item.name for item in dictionary.aAgency track by item.elementId'>"+
                                "<option value=''>Please select an Agency</option>"+
                            "</select>"+

                        "</div>"+
                        "<div class='input-field usa-width-one-fourth'>"+
                            "<h3><label for='jqOfficeFH'>Office</label></h3>"+
                            "<select id='jqOfficeFH' name='office' class='usa-form-medium' ng-change='setOrganizationId(\"office\")' ng-model='selectedOfficeId' ng-options='item.name for item in dictionary.aOffice track by item.elementId'>"+
                                "<option value=''>Please select an Office</option>"+
                            "</select>"+

                        "</div>"+
                    "</div>"+
                    "{{ error }}"+
                "</div>"
        };
    }]);
}();
