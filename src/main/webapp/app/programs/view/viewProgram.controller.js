!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', '$filter', '$parse', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary', 'appUtil', 'Contact',
        function ($state, $scope, $stateParams, $filter, $parse, appConstants, SearchFactory, ProgramFactory, Dictionary, appUtil, Contacts) {
            var vm = this;
            $scope.appUtil = appUtil;


            ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                $scope.programData = data;
                console.log($scope.programData);

                angular.extend(vm, {
                    choices: angular.extend({
                        programs: ProgramFactory.query({limit: 2500, status: 'Published'}),
                        contacts: (typeof $scope.programData.agencyId !== 'undefined') ? Contacts.query({agencyId: $scope.programData.agencyId}) : {},
                        offices: [
                            {
                                id: 1,
                                name: 'Test Office'
                            },
                            {
                                id: 2,
                                name: 'Dev Office'
                            },
                            {
                                id: 3,
                                name: 'Admin Office'
                            }
                        ]
                    })
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



            function getChoiceModel(value, key, dictionaryName) {
                var getter = $parse(key),
                    selectedChoice = null;

                angular.forEach(vm.choices[dictionaryName], function (choice) {
                    if (getter(choice) === value) {
                        selectedChoice = choice;
                    }
                });

                return selectedChoice;
            }

            function formatModelString(value, key, dictionaryName, exp) {
                var model = getChoiceModel(value, key, dictionaryName);
                if (model) {
                    return $parse(exp)(model);
                } else {
                    return "Error: " + dictionaryName + " " + value + " not found";
                }
            }


        }
    ]);
}();