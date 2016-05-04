!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('RequestViewCtrl', ['$stateParams', '$scope', 'RequestFactory', 'Request', 'AuthorizationService', 'PERMISSIONS',
        function($stateParams, $scope, RequestFactory, Request, AuthorizationService, PERMISSIONS) {
            $scope.requestMapping = {
                archive_request: {
                    approve: 'archive',
                    reject: 'archive_reject',
                    permissionRequired: PERMISSIONS.CAN_PERFORM_ARCHIVE
                },
                title_request: {
                    approve: 'title',
                    reject: 'title_reject',
                    permissionRequired: PERMISSIONS.CAN_PERFORM_TITLE_CHANGE
                },
                agency_request: {
                    approve: 'agency',
                    reject: 'agency_reject',
                    permissionRequired: PERMISSIONS.CAN_PERFORM_AGENCY_CHANGE
                },
                program_number_request: {
                    approve: 'program_number',
                    reject: 'program_number_reject'
                },
                unarchive_request: {
                    approve: 'unarchive',
                    reject: 'unarchive_reject',
                    permissionRequired: PERMISSIONS.CAN_PERFORM_UNARCHIVE
                }
            };

            $scope.id = $stateParams.id;

            RequestFactory.get({id: $scope.id}).$promise.then(function(data){
                $scope.request = new Request(data);
            });

            $scope.isTitleRequest = function() {
                return $scope.request.getType() === 'title_request';
            };

            $scope.isSubmitRequest = function() {
                return $scope.request.getType() === 'submit';
            };

            $scope.isReviseRequest = function() {
                return $scope.request.getType() === 'revise';
            };

            $scope.isAgencyRequest = function() {
                return $scope.request.getType() === 'agency_request';
            };

            $scope.getRequestedTitle = function() {
                return $scope.request.getData()['title'];
            };

            $scope.getRequestedOrganization = function(){
                return $scope.request.getData()['organizationId'];
            };

            $scope.approveRequest = function() {
                handleRequest($scope.requestMapping[$scope.request.getType()]['approve']);
            };

            $scope.rejectRequest = function() {
                handleRequest($scope.requestMapping[$scope.request.getType()]['reject']);
            };

            $scope.hasPermissions = function() {
                return AuthorizationService.authorize($scope.requestMapping[$scope.request.getType()]['permissionRequired']);
            };

            function handleRequest(actionType) {
                $scope.showProgramRequestModal($scope.request.getRaw(), 'program_request_action', actionType);
            }
        }
    ]);
}();