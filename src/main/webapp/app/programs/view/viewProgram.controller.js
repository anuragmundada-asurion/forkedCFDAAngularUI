!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', '$filter', '$parse', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary', 'appUtil', 'Contact', 'FederalHierarchyService',
        function ($state, $scope, $stateParams, $filter, $parse, appConstants, SearchFactory, ProgramFactory, Dictionary, appUtil, Contacts, FederalHierarchyService) {
            var vm = this;
            $scope.appUtil = appUtil;

            ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                $scope.programData = data;
                $scope.getAgencyName($scope.programData.agencyId);
            });

            $scope.relatedPrograms = ProgramFactory.query({limit: 2500, status: 'Published'});

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

            $scope.formatModelString = function (item) {
                var model = null;

                model = $scope.relatedPrograms.filter(function (rp) {
                    return rp['data']['_id'] == item;
                });

                if (model[0]) {
                    return model[0]['data']['programNumber'] + ' ' + model[0]['data']['title'];
                } else {
                    return "Error: " + $scope.relatedPrograms + " " + " not found";
                }
            };

            $scope.getAgencyName = function (id) {
                FederalHierarchyService.getFederalHierarchyById(id, function (data) {
                    $scope.agencyName = data.name;
                });
            };



        }
    ]);
}();