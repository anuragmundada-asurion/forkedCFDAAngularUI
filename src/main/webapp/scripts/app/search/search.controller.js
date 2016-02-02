!function() {
    'use strict';

    angular.module('app').controller('ProgramSearchCtrl', ['$rootScope', '$scope', '$stateParams', '$location',
        function($rootScope, $scope, $stateParams, $location) {
            $scope['globalSearchValue'] = $rootScope['globalSearchValue'] || $stateParams['keyword'] || '';
            $scope.searchKeyUp = function(keyCode) {
                if (keyCode === 13) {
                    $scope.searchPrograms();
                }
            };

            $scope.searchPrograms = function() {
                if ($scope['globalSearchValue']) {
                    $rootScope['globalSearchValue'] = $scope['globalSearchValue'];
                    $location.path('/search').search('keyword', $scope['globalSearchValue']);
                }
            };
        }
    ]);
}();