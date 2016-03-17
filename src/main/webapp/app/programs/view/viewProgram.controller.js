!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', '$filter', '$parse', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary', 'appUtil',
        function ($state, $scope, $stateParams, $filter, $parse, appConstants, SearchFactory, ProgramFactory, Dictionary, appUtil) {

            ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                $scope.programData = data;
            });

            Dictionary.query({ids: ['assistance_type', 'applicant_types', 'assistance_usage_types', 'beneficiary_types']}, function (data) {
                $scope.allTypes = {
                    assistance_type: data['assistance_type'],
                    applicant_types: data['applicant_types'],
                    assistance_usage_types: data['assistance_usage_types'],
                    beneficiary_types: data['beneficiary_types']
                };
            });

            $scope.traverseTree = function(value, dictionaryName) {
                var selected = $filter('traverseTree')([value], $scope.allTypes[dictionaryName], {
                    branches: {
                        X: {
                            keyProperty: $parse('element_id'),
                            childrenProperty: $parse('elements')
                        }
                    }
                })[0];
                return selected ? selected.$original : null;
            };

            $scope.appUtil = appUtil;
        }
    ]);
}();