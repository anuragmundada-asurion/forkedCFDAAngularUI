!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.constant('PERMISSIONS', {
        'CAN_QUERY_PUBLISHED_PROGRAMS': 'CanQueryPublishedPrograms',
        'CAN_QUERY_REGIONAL_AGENCY_OFFICES': 'CanQueryRegionalAgencyOffices',
        'CAN_VIEW_PROGRAMS': 'CanViewPrograms',
        'CAN_CREATE_PROGRAMS': 'CanCreatePrograms',
        'CAN_EDIT_PROGRAMS': 'CanEditPrograms',
        'CAN_REVIEW_PROGRAMS': 'CanReviewPrograms',
        'CAN_APPROVE_PROGRAMS': 'CanApprovePrograms',
        'CAN_REJECT_PROGRAMS': 'CanRejectPrograms',
        'CAN_SUBMIT_OMB': 'CanSubmitOmb',
        'CAN_SUBMIT_GSA': 'CanSubmitGsa',
        'CAN_PUBLISH': 'CanPublish',
        'CAN_VIEW_ARCHIVE_PROGRAMS': 'CanViewArchivePrograms',
        'CAN_REQUEST_TITLE_CHANGE': 'CanRequestTitleChange',
        'CAN_APPROVE_TITLE_CHANGE': 'CanApproveTitleChange',
        'CAN_REQUEST_ARCHIVE': 'CanRequestArchive',
        'CAN_APPROVE_ARCHIVE': 'CanApproveArchive',
        'CAN_REQUEST_UNARCHIVE': 'CanRequestUnarchive',
        'CAN_APPROVE_UNARCHIVE': 'CanApproveUnarchive'
    });

    myApp.run(['$rootScope', 'PERMISSIONS', function($rootScope, PERMISSIONS) {
        $rootScope.PERMISSIONS = PERMISSIONS;
    }]);
}();