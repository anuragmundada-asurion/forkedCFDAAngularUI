!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.constant('RequestActionMapping', {
        archive_request: {
            approve: 'archive',
            reject: 'archive_reject'
        },
        title_request: {
            approve: 'title',
            reject: 'title_reject'
        },
        agency_request: {
            approve: 'agency',
            reject: 'agency_reject'
        },
        program_number_request: {
            approve: 'program_number',
            reject: 'program_number_reject'
        },
        unarchive_request: {
            approve: 'unarchive',
            reject: 'unarchive_reject'
        }
    });

    myApp.controller('RequestViewCtrl', ['$stateParams', '$scope', 'RequestFactory', 'Request', 'RequestActionMapping',
        function($stateParams, $scope, RequestFactory, Request, RequestActionMapping) {
            $scope.id = $stateParams.id;

            RequestFactory.get({id: $scope.id}).$promise.then(function(data){
                $scope.request = new Request(data);
            });

            $scope.isTitleRequest = function() {
                return $scope.request.getType() === 'title_request';
            };

            $scope.isAgencyRequest = function() {
                return $scope.request.getType() === 'agency_request';
            };

            $scope.getRequestedTitle = function() {
                return $scope.request.getData()['title'];
            };

            $scope.approveRequest = function() {
                handleRequest(RequestActionMapping[$scope.request.getType()]['approve']);
            };

            $scope.rejectRequest = function() {
                handleRequest(RequestActionMapping[$scope.request.getType()]['reject']);
            };

            function handleRequest(actionType) {
                $scope.showProgramRequestModal($scope.request.getRaw(), 'program_request_action', actionType);
            }
        }
    ]);
}();