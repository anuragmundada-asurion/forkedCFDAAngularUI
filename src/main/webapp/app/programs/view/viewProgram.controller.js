!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams',  '$filter', '$parse', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary',
        function ($state, $scope, $stateParams,  $filter, $parse, appConstants, SearchFactory, ProgramFactory, Dictionary) {
            ProgramFactory.get({id: $stateParams.id}).$promise.then(function(data) {
                $scope.programData = data;
                console.log($scope.programData);
            });

            Dictionary.query({ ids: ['assistance_type'] }, function(data) {
                //Assistance Types
                $scope.aAssistanceType = data['assistance_type'];
            });

            $scope.traverseTree = function(value) {
                var selected = $filter('traverseTree')([value], $scope.aAssistanceType, {
                    branches: {
                        X: {
                            keyProperty: $parse('element_id'),
                            childrenProperty: $parse('elements')
                        }
                    }
                })[0];
                return selected ? selected.$original : null;
            }
        }
    ]);
}();