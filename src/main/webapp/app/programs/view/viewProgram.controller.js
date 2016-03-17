!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams',  '$filter', '$parse', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary',
        function ($state, $scope, $stateParams,  $filter, $parse, appConstants, SearchFactory, ProgramFactory, Dictionary) {
            ProgramFactory.get({id: $stateParams.id}).$promise.then(function(data) {
                $scope.programData = data;
                //console.log($scope.programData);
            });

            Dictionary.query({ ids: ['assistance_type', 'applicant_types'] }, function(data) {
                //Assistance Types
                $scope.aAssistanceType = data['assistance_type'];
                $scope.aApplicantType = data['applicant_types'];
                console.log(data);
                $scope.allTypes = $scope.aAssistanceType.concat($scope.aApplicantType);

            });

            $scope.traverseTree = function(value) {
                var selected = $filter('traverseTree')([value], $scope.allTypes, {
                    branches: {
                        X: {
                            keyProperty: $parse('element_id'),
                            childrenProperty: $parse('elements')
                        }
                    }
                })[0];
                if(selected){
                    console.log("returnging this: " + selected.$original);
                }else{
                    console.log("selected was null");
                }
                return selected ? selected.$original : null;
            };


        }
    ]);
}();