(function(){
    "use strict";

    var myApp = angular.module('app');

    myApp.service('ProgramService', ['ApiService', function (ApiService){

        /**
         * common function to perform an API CALL
         * 
         * @param Object oApiParam {
         *          apiName: '',
         *          apiSuffix: '',
         *          oParams: {}, only for GET method
         *          oData: {}, for others method rather then GET
         *          method: '' (GET|POST|PUT...)
         *      }
         * @param Function cbFnSuccess
         * @param Function cbFnError
         * @returns {$q@call;defer.promise}
         */
        this.query = function(oApiParam, cbFnSuccess, cbFnError) {
            //prepend / to suffix api url if provided
            oApiParam.apiSuffix = (oApiParam.apiSuffix !== '') ? '/'+oApiParam.apiSuffix : '';

            return ApiService.call(oApiParam);
        };
        
    }]);

})();