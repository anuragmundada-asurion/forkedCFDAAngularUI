(function () {
    "use strict";

    var myApp = angular.module('app');

    myApp.service('FederalHierarchyService', ['ApiService', function (ApiService) {
        this.getFederalHierarchyById = function (id, includeParentLevels, includeChildrenLevels, callbackFnSuccess) {
            var oApiParam = {
                apiName: 'federalHierarchyList',
                apiSuffix: '/' + id,
                oParams: {},
                oData: {},
                method: 'GET'
            };

            if (includeParentLevels) {
                oApiParam.oParams['parentLevels'] = 'all';
            }

            if (includeChildrenLevels) {
                oApiParam.oParams['childrenLevels'] = 'all';
            }

            //make api call to get federalHierarchy by id
            ApiService.call(oApiParam).then(
                function (data) {
                    if (typeof callbackFnSuccess === 'function') {
                        callbackFnSuccess(data);
                    }
                },
                function (error) {
                    return false;
                }
            );
        };


        this.getParentPath = function (id, success) {
            this.getFederalHierarchyById(id, true, false, function (fhData) {
                var levels = {};
                while (fhData.name) {
                    levels[fhData.type] = fhData.name;
                    if (fhData.hierarchy) {
                        fhData = fhData.hierarchy[0];
                    }
                    else {
                        break;
                    }
                }
                success(levels);
            }, function (error) {
                console.log("Error occured: ", error);
            });
        };


    }]);
})();
