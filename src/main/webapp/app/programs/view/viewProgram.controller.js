!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', '$filter', '$parse', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary',
        function ($state, $scope, $stateParams, $filter, $parse, appConstants, SearchFactory, ProgramFactory, Dictionary) {
            ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                $scope.programData = data;
            });

            Dictionary.query({ids: ['assistance_type', 'applicant_types', 'assistance_usage_types', 'beneficiary_types']}, function (data) {
                $scope.allTypes = data['assistance_type'].concat(data['applicant_types']).concat(data['assistance_usage_types']).concat(data['beneficiary_types']);
            });

            $scope.traverseTree = function (value) {
                var selected = $filter('traverseTree')([value], $scope.allTypes, {
                    branches: {
                        X: {
                            keyProperty: $parse('element_id'),
                            childrenProperty: $parse('elements')
                        }
                    }
                })[0];
                return selected ? selected.$original : null;
            };


        }
    ]);
}();