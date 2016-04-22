(function () {
    "use strict";

    var myApp = angular.module('app');

    myApp.service('FhConfigurationService', ['ApiService', 'OrganizationFactory', 'FederalHierarchyService', function (ApiService, OrganizationFactory, FederalHierarchyService) {




        /**
         * call on config facctory, and then  add some more data via the fh service
         * @param oData
         * @param aSelectedData
         * @returns Object
         */
        var getFhConfiguration = function (id, callbackSuccess) {

            var fullData = {};

            //factory doesnt' return the entire data that i need
            OrganizationFactory.get(id).$promise.then(function (data) {
                console.log('got this data from FACTORY... : ', data);
                //call on fh to get the rest
                FederalHierarchyService.getFederalHierarchyById(data.organizationId, false, false, function (d) {
                    data.name = d.name;
                    data.agencyProgramCode = d.cfdaCode;
                    data.acronym = 'Not available';
                    data.agencyCode = 'Not available';

                    fullData = data;
                    console.log('returnign this FULL DATA:', fullData);
                    callbackSuccess(fullData);
                });
            });


        };


        //methods
        return {
            getFhConfiguration: getFhConfiguration

        };


    }]);
})();
