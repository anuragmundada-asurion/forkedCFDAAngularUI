!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary',
        function ($state, $scope, $stateParams, appConstants, SearchFactory, ProgramFactory, Dictionary) {
            console.log("hello world from viewProgramController... yay!");
            ProgramFactory.get({id: $stateParams.id}).$promise.then(function(data) {
                $scope.program = data;
                $scope.programData = $scope.program.data;
                console.log($scope.program);
            });
        }
    ]);
}();