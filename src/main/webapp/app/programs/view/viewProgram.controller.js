!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', '$filter', '$parse', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary', 'appUtil', 'Contact', 'FederalHierarchyService', '$q', '$log', 'ApiService',
        function ($state, $scope, $stateParams, $filter, $parse, appConstants, SearchFactory, ProgramFactory, Dictionary, appUtil, Contacts, FederalHierarchyService, $q, $log, ApiService) {
            $scope.appUtil = appUtil;
            $scope.$log = $log;
            $scope.programId = $stateParams.id;


            ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                $scope.programData = data;
                //console.log($scope.programData);
                if ($scope.programData['relatedPrograms'] && $scope.programData['relatedPrograms']['flag'] === 'yes') {
                    var promises = [];
                    angular.forEach($scope.programData['relatedPrograms']['relatedTo'], function (item, key) {
                        promises.push(ProgramFactory.get({id: item}).$promise);
                    });

                    $q.all(promises).then(function (values) {
                        $scope.relatedPrograms = values;
                    });
                }

                //get historical index data
                var params = {
                    apiName: 'historicalIndex',
                    apiSuffix: '/' + $scope.programId,
                    oParams: {programNumber: $scope.programData.programNumber},
                    oData: {},
                    method: 'GET'
                };

                ApiService.call(params).then(function (data) {
                    $scope.historicalIndex = data;
                    //console.log(data);
                });


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


        }
    ]);
}();