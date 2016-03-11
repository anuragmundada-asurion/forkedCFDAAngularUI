!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewProgramCtrl', ['$state', '$scope', '$stateParams', 'appConstants', 'SearchFactory', 'ProgramFactory', 'Dictionary',
        function ($state, $scope, $stateParams, appConstants, SearchFactory, ProgramFactory, Dictionary) {
            console.log("hello world from viewProgramController... yay!");
            $scope.program = {};

            if ($state.current['name'] === 'viewProgram') {
                ProgramFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                    $scope.program = data;
                    console.log($scope.program);
                });
            } else {
                console.log("state is NOT view program!!!");
                console.log($state.current['name']);
            }

        }
    ]);
}();