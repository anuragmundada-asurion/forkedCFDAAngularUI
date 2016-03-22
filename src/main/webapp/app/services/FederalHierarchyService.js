(function(){
    "use strict";

    var myApp = angular.module('app');

    myApp.service('FederalHierarchyService', ['ApiService', function (ApiService){
        this.getFederalHierarchyById = function(id, callbackFnSuccess) {
            var oApiParam = {
                apiName: 'federalHierarchyList',
                apiSuffix: '/' + id,
                oParams: {},
                oData: {},
                method: 'GET'
            };

            //make api call to get federalHierarchy by id
            ApiService.call(oApiParam).then(
            function (data) {
                if(typeof callbackFnSuccess === 'function'){
                    callbackFnSuccess(data);
                }
                return data;
            }, 
            function(error){
                return false;
            });
        };
    }]);
})();
