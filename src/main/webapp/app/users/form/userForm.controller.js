!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserFormCtrl', ['$scope', '$timeout',
        function($scope, $timeout) {
            //  Mock API call to backend
            $timeout(function() {
                $scope.user = new User({
                    "id": "malcolmnjoseph",
                    "firstName": "Malcolm",
                    "lastName": "Joseph",
                    "fullName": "Malcolm Nathaniel Joseph",
                    "email": "mjoseph@reisystems.com",
                    "iamRoles": [
                        "GSA_PaasPortalUI_R_Dev",
                        "GSA_FBO_R_Buyer",
                        "GSA_IAM_CWS_SFA_R_SrvAcct",
                        "GSA_CFDA_R_cfdasuperuser"
                    ],
                    "cfdaRole":  "GSA_CFDA_R_agency_submitter",
                    "permissions": [
                        "CanQueryPublishedPrograms",
                        "CanQueryPrograms",
                        "CanViewProgram",
                        "CanCreatePrograms",
                        "CanEditDraftPrograms",
                        "CanReviewPrograms",
                        "CanRequestTitleChange",
                        "CanRequestArchive",
                        "CanRequestUnarchive",
                        "CanViewArchivedPrograms",
                        "CanRequestSubmission",
                        "CanDeleteDraftPrograms",
                        "CanCreateRegionalOffice",
                        "CanEditRegionalOffice",
                        "CanDeleteRegionalOffice",
                        "CanViewRegionalOffice",
                        "CanViewOrganizationConfig",
                        "CanEditPublishedPrograms",
                        "CanViewUsers"
                    ]
                });
            }, 3000);
        }
    ]);
}();