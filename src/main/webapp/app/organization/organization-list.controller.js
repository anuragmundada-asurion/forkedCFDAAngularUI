(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationListController', ['$scope', '$log', '$timeout', '$http', 'appConstants', 'ApiService', 'Dictionary', 'FederalHierarchyService', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$q',
        function ($scope, $log, $timeout, $http, appConstants, ApiService, Dictionary, FederalHierarchyService, UserService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $q) {


            console.log('hello from organization list ctrl!!');
        }]);

})();
