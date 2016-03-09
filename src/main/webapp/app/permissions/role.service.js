!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('ROLES', ['PERMISSIONS', function(PERMISSIONS) {
        this.ANONYMOUS = {
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_REGIONAL_AGENCY_OFFICES,
                PERMISSIONS.CAN_VIEW_PROGRAMS,
                PERMISSIONS.CAN_VIEW_ARCHIVE_PROGRAMS
            ]
        };
        this.SUPER_USER = {
            'iamRoleId' : 'GSA_CFDA_R_cfdasuperuser',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_REGIONAL_AGENCY_OFFICES,
                PERMISSIONS.CAN_VIEW_PROGRAMS,
                PERMISSIONS.CAN_CREATE_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_PUBLISH,
                PERMISSIONS.CAN_VIEW_ARCHIVE_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_APPROVE_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_APPROVE_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                PERMISSIONS.CAN_APPROVE_UNARCHIVE
            ]
        };
        this.AGENCY_COORDINATOR = {
            'iamRoleId' : 'GSA_CFDA_R_cfda_agency_coord',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_REGIONAL_AGENCY_OFFICES,
                PERMISSIONS.CAN_VIEW_PROGRAMS,
                PERMISSIONS.CAN_CREATE_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_PUBLISH,
                PERMISSIONS.CAN_VIEW_ARCHIVE_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_APPROVE_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_APPROVE_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                PERMISSIONS.CAN_APPROVE_UNARCHIVE
            ]
        };
        this.AGENCY_USER = {
            'iamRoleId' : 'GSA_CFDA_R_agency_submitter',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_REGIONAL_AGENCY_OFFICES,
                PERMISSIONS.CAN_VIEW_PROGRAMS,
                PERMISSIONS.CAN_CREATE_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_VIEW_ARCHIVE_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE
            ]
        };
        this.OMB_ANALYST = {
            'iamRoleId' : 'GSA_CFDA_R_omb_analyst',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_REGIONAL_AGENCY_OFFICES,
                PERMISSIONS.CAN_VIEW_PROGRAMS,
                PERMISSIONS.CAN_CREATE_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_PUBLISH,
                PERMISSIONS.CAN_VIEW_ARCHIVE_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE
            ]
        };
        this.GSA_ANALYST = {
            'iamRoleId' : 'GSA_CFDA_R_gsa_analyst',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_REGIONAL_AGENCY_OFFICES,
                PERMISSIONS.CAN_VIEW_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_PUBLISH,
                PERMISSIONS.CAN_VIEW_ARCHIVE_PROGRAMS
            ]
        };
        this.RMO_SUPER_USER = {
            'iamRoleId' : 'GSA_CFDA_R_rmo_superuser',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_REGIONAL_AGENCY_OFFICES,
                PERMISSIONS.CAN_VIEW_PROGRAMS,
                PERMISSIONS.CAN_CREATE_PROGRAMS,
                PERMISSIONS.CAN_EDIT_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_PUBLISH,
                PERMISSIONS.CAN_VIEW_ARCHIVE_PROGRAMS,
                PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                PERMISSIONS.CAN_REQUEST_ARCHIVE,
                PERMISSIONS.CAN_REQUEST_UNARCHIVE
            ]
        };

        this.LIMITED_SUPER_USER = {
            'iamRoleId' : 'GSA_CFDA_R_cfdalimitedsuperuser',
            'permissions': [
                PERMISSIONS.CAN_QUERY_PUBLISHED_PROGRAMS,
                PERMISSIONS.CAN_QUERY_REGIONAL_AGENCY_OFFICES,
                PERMISSIONS.CAN_VIEW_PROGRAMS,
                PERMISSIONS.CAN_REVIEW_PROGRAMS,
                PERMISSIONS.CAN_VIEW_ARCHIVE_PROGRAMS
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

    myApp.service('PermissionService', ['ROLES', function(ROLES) {
        this.getPermissionsFromIAMRole = function(iamRole) {
            var role = null;

            ROLES.ROLE_LIST.every(function(r) {
                if (iamRole === r.iamRoleId) {
                    role = r;
                    return false;
                } else {
                    return true;
                }
            });

            return role ? role.permissions : [];
        };
    }]);

    myApp.run(['$rootScope', 'ROLES', function($rootScope, ROLES) {
        $rootScope.ROLES = ROLES;
    }]);
}();