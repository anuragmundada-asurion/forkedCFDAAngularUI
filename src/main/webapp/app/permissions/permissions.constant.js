!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.constant('PERMISSIONS', {

        //  Database Search
        'CAN_QUERY_PROGRAMS': 'CanQueryPrograms',

        //  Regional Office
        'CAN_CREATE_REGIONAL_OFFICE': 'CanCreateRegionalOffice',
        'CAN_EDIT_REGIONAL_OFFICE': 'CanEditRegionalOffice',
        'CAN_DELETE_REGIONAL_OFFICE': 'CanDeleteRegionalOffice',

        //  Historical Index
        'CAN_CREATE_HISTORICAL_INDEX': 'CanCreateHistoricalIndex',
        'CAN_VIEW_HISTORICAL_INDEX': 'CanViewHistoricalIndex',
        'CAN_EDIT_HISTORICAL_INDEX': 'CanEditHistoricalIndex',
        'CAN_DELETE_HISTORICAL_INDEX': 'CanDeleteHistoricalIndex',

        //  Create Draft Program
        'CAN_CREATE_PROGRAMS': 'CanCreatePrograms',

        //  Edit Draft Program
        'CAN_EDIT_DRAFT_PROGRAMS': 'CanEditDraftPrograms',

        //  Delete Draft Program
        'CAN_DELETE_DRAFT_PROGRAMS': 'CanDeleteDraftPrograms',

        //  Review Program Page
        'CAN_REVIEW_PROGRAMS': 'CanReviewPrograms',

        //  View Requests Page
        'CAN_VIEW_REQUESTS': 'CanViewRequests',

        //  Title change request
        'CAN_REQUEST_TITLE_CHANGE': 'CanRequestTitleChange',
        'CAN_PERFORM_TITLE_CHANGE': 'CanPerformTitleChange',

        //  Agency change request
        'CAN_REQUEST_AGENCY_CHANGE': 'CanRequestAgencyChange',
        'CAN_PERFORM_AGENCY_CHANGE': 'CanPerformAgencyChange',

        //  Archive request
        'CAN_REQUEST_ARCHIVE': 'CanRequestArchive',
        'CAN_PERFORM_ARCHIVE': 'CanPerformArchive',

        //  Unarchive Request
        'CAN_REQUEST_UNARCHIVE': 'CanRequestUnarchive',
        'CAN_PERFORM_UNARCHIVE': 'CanPerformUnarchive',

        'CAN_VIEW_ARCHIVED_PROGRAMS': 'CanViewArchivedPrograms',

        //  Submitting/Publishing
        'CAN_EDIT_PENDING_PROGRAMS': 'CanEditPendingPrograms',
        'CAN_REQUEST_SUBMISSION': 'CanRequestSubmission',
        'CAN_REQUEST_SUBMISSION_OUTSIDE_RANGE': 'CanRequestSubmissionOutsideRange',
        'CAN_PERFORM_SUBMISSION': 'CanPerformSubmission',

        //  Create Revision
        'CAN_EDIT_PUBLISHED_PROGRAMS' : 'CanEditPublishedPrograms',

        // Configure Organizations
        'CAN_VIEW_ORGANIZATION_CONFIG' : 'CanViewOrganizationConfig',
        'CAN_EDIT_ORGANIZATION_CONFIG' : 'CanEditOrganizationConfig',

        //  User Profiles
        'CAN_VIEW_USERS' : 'CanViewUsers',
        'CAN_EDIT_USERS' : 'CanEditUsers'
    });

    myApp.run(['$rootScope', 'PERMISSIONS', function($rootScope, PERMISSIONS) {
        $rootScope.PERMISSIONS = PERMISSIONS;
    }]);
}();