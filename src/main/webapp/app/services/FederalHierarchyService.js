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

            if(includeParentLevels) {
                oApiParam.oParams['parentLevels'] = 'all';
            }

            if(includeChildrenLevels) {
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
    }]);
})();
