!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.directive('federalHierarchyLabel', ['FederalHierarchyService', function(FederalHierarchyService) {
        return {
            restrict: 'EA',
            scope: {
                "organizationId": "@"
            },
            link: function(scope, element, attributes) {
                //Call FederalHierarchy API and get Label of the organization
                FederalHierarchyService.getFederalHierarchyById(scope.organizationId, function(oOrganization){
                    if(oOrganization && oOrganization.hasOwnProperty('name')){
                        scope.organizationName = oOrganization.name;
                    }
                }, function(error){
                    scope.organizationName = "An error has occurred, Please try again !";
                });
            },
            template: '<img ng-show="!organizationName" style="max-width: 10%;" src="/img/img_cfda/loading.svg" />{{ organizationName }}'
        };
    }]);
}();