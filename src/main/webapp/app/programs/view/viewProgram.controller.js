!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', '$filter', '$parse', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary', 'appUtil',
        function ($state, $scope, $stateParams, $filter, $parse, appConstants, SearchFactory, ProgramFactory, Dictionary, appUtil) {
            console.log("hello from the ViewProgramCtrl.. yay!");
            ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                $scope.programData = data;
                console.log("got the program data: ", $scope.programData);
                console.log('values: ' , $scope.programData.financial.obligations.values);

            });

            Dictionary.query({ids: ['assistance_type', 'applicant_types', 'assistance_usage_types', 'beneficiary_types', 'yes_no_na']}, function (data) {
                $scope.allTypes = {
                    assistance_type: data['assistance_type'],
                    applicant_types: data['applicant_types'],
                    assistance_usage_types: data['assistance_usage_types'],
                    beneficiary_types: data['beneficiary_types'],
                    yes_no_na: data['yes_no_na']
                };

                $scope.traverseTree = function (value, dictionaryName) {
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
            });

            $scope.appUtil = appUtil;
        }
    ]);
}();