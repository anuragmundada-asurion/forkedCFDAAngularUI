!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('ROLES', ['PERMISSIONS', function(PERMISSIONS) {
        this.ANONYMOUS = {
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_VIEW_PROGRAM,
                PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
            ]
        };
        this.SUPER_USER = {
            'iamRoleId' : 'GSA_CFDA_R_cfdasuperuser',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_PROGRAMS,
                PERMISSIONS.CAN_VIEW_PROGRAM,
                PERMISSIONS.CAN_CREATE_PROGRAMS,
                PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_PERFORM_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_PERFORM_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                PERMISSIONS.CAN_PERFORM_UNARCHIVE,
                PERMISSIONS.CAN_VIEW_ARCHIVED_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_SUBMISSION,
                PERMISSIONS.CAN_PERFORM_SUBMISSION,
                PERMISSIONS.CAN_DELETE_DRAFT_PROGRAMS,
                PERMISSIONS.CAN_CREATE_REGIONAL_OFFICE,
                PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE,
                PERMISSIONS.CAN_DELETE_REGIONAL_OFFICE,
                PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
            ]
        };
        this.AGENCY_COORDINATOR = {
            'iamRoleId' : 'GSA_CFDA_R_cfda_agency_coord',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_PROGRAMS,
                PERMISSIONS.CAN_VIEW_PROGRAM,
                PERMISSIONS.CAN_CREATE_PROGRAMS,
                PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_PERFORM_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_PERFORM_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                PERMISSIONS.CAN_PERFORM_UNARCHIVE,
                PERMISSIONS.CAN_VIEW_ARCHIVED_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_SUBMISSION,
                PERMISSIONS.CAN_DELETE_DRAFT_PROGRAMS,
                PERMISSIONS.CAN_CREATE_REGIONAL_OFFICE,
                PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE,
                PERMISSIONS.CAN_DELETE_REGIONAL_OFFICE,
                PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
            ]
        };
        this.AGENCY_USER = {
            'iamRoleId' : 'GSA_CFDA_R_agency_submitter',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_PROGRAMS,
                PERMISSIONS.CAN_VIEW_PROGRAM,
                PERMISSIONS.CAN_CREATE_PROGRAMS,
                PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                PERMISSIONS.CAN_VIEW_ARCHIVED_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_SUBMISSION,
                PERMISSIONS.CAN_DELETE_DRAFT_PROGRAMS,
                PERMISSIONS.CAN_CREATE_REGIONAL_OFFICE,
                PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE,
                PERMISSIONS.CAN_DELETE_REGIONAL_OFFICE,
                PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
            ]
        };
        this.OMB_ANALYST = {
            'iamRoleId' : 'GSA_CFDA_R_omb_analyst',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_PROGRAMS,
                PERMISSIONS.CAN_VIEW_PROGRAM,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                PERMISSIONS.CAN_VIEW_ARCHIVED_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS,
                PERMISSIONS.CAN_PERFORM_SUBMISSION,
                PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
            ]
        };
        this.GSA_ANALYST = {
            'iamRoleId' : 'GSA_CFDA_R_gsa_analyst',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_PROGRAMS,
                PERMISSIONS.CAN_VIEW_PROGRAM,
                PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_VIEW_ARCHIVED_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS,
                PERMISSIONS.CAN_PERFORM_SUBMISSION,
                PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
            ]
        };
        this.RMO_SUPER_USER = {
            'iamRoleId' : 'GSA_CFDA_R_rmo_superuser',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_PROGRAMS,
                PERMISSIONS.CAN_VIEW_PROGRAM,
                PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                PERMISSIONS.CAN_VIEW_ARCHIVED_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS,
                PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
            ]
        };

        this.LIMITED_SUPER_USER = {
            'iamRoleId' : 'GSA_CFDA_R_cfdalimitedsuperuser',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_PROGRAMS,
                PERMISSIONS.CAN_VIEW_PROGRAM,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_VIEW_ARCHIVED_PROGRAMS,
                PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
            ]
        };

        this.ROLE_LIST = [
            this.ANONYMOUS,
            this.SUPER_USER,
            this.AGENCY_COORDINATOR,
            this.AGENCY_USER,
            this.OMB_ANALYST,
            this.GSA_ANALYST,
            this.RMO_SUPER_USER,
            this.LIMITED_SUPER_USER
        ];
    }]);

    myApp.service('RoleService', ['ROLES', function(ROLES) {
        this.getRoleFromIAMRole = function(iamRole) {
            var role = null;

            ROLES.ROLE_LIST.every(function(r) {
                if (iamRole === r.iamRoleId) {
                    role = r;
                    return false;
                } else {
                    return true;
                }
            });

            return role;
        }
    }]);

    myApp.run(['$rootScope', 'ROLES', function($rootScope, ROLES) {
        $rootScope.ROLES = ROLES;
    }]);
}();