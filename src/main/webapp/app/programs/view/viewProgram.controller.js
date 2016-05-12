!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', '$filter', '$parse', 'ProgramFactory', 'Dictionary', 'appUtil', 'FederalHierarchyService', '$q', 'ApiService',
        function ($state, $scope, $stateParams, $filter, $parse, ProgramFactory, Dictionary, appUtil, FederalHierarchyService, $q, ApiService) {
            $scope.appUtil = appUtil;
            $scope.onPreviewPage = $state.current.data.onPreviewPage;
            $scope.format = function (year) {
                return year.substring(year.length - 2, year.length);
            };

            ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                $scope.programData = data;
                //getting names of related programs
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
                    apiSuffix: '/' + $stateParams.id,
                    oParams: {programNumber: $scope.programData.programNumber},
                    oData: {},
                    method: 'GET'
                };
                ApiService.call(params).then(function (data) {
                    $scope.historicalIndex = data;
                });


                //make call to federalHierarchy
                FederalHierarchyService.getParentPath($scope.programData.organizationId, function (data) {
                    $scope.hierarchyLevels = data;
                });

            });

            Dictionary.query({ids: ['assistance_type', 'applicant_types', 'assistance_usage_types', 'beneficiary_types', 'yes_no_na', 'phasing_assistance']}, function (data) {
                $scope.allTypes = {
                    assistance_type: data['assistance_type'],
                    applicant_types: data['applicant_types'],
                    assistance_usage_types: data['assistance_usage_types'],
                    beneficiary_types: data['beneficiary_types'],
                    yes_no_na: data['yes_no_na'],
                    phasing_assistance: data['phasing_assistance']
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
