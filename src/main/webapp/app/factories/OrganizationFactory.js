(function () {
    "use strict";

    var myApp = angular.module('app');

    myApp.factory('OrganizationFactory', ['$resource', 'ApiService', 'FederalHierarchyService', function ($resource, ApiService, FederalHierarchyService) {
        return $resource(ApiService.APIs.federalHierarchyConfigurationEntity, {
            id: '@_id'
        }, {
            get: {
                transformResponse: function (data) {
                    console.log('Before: ',data);

                    data = JSON.parse(data);
                    //add more fields
                    FederalHierarchyService.getFederalHierarchyById(data.organizationId, false, false, function (d) {
                        console.log('calling fh with this id: ', data.organizationId, 'got back d: ', d);
                        data.name = d.name;
                        data.agencyProgramCode = d.cfdaCode;
                        data.acronym = 'Not available';
                        data.agencyCode = 'Not available';


                        console.log('returning data as : ', data);
                        return data;
                    });

                    return data;
                }

            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH',
                params: {
                    id: '@_id'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    id: '@_id'
                }
            }
        });
    }]);
})();