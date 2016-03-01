(function(){
    "use strict";

    angular.module('app')
        .controller('HomeController', ['$scope', 'appConstants', 'ApiService', 'moment',
        function ($scope, appConstants, ApiService, moment) {

        angular.extend($scope, {
            itemsByPage: appConstants.DEFAULT_PAGE_ITEM_NUMBER,
            itemsByPageNumbers: appConstants.PAGE_ITEM_NUMBERS,
            currentYear: new moment().subtract(1, 'year').format('YYYY'),

            data: {
                singleSelect: null,
                multipleSelect: [],
                option1: 'option-1'
            }
        });

        /**
         * return correct format to use for rounding up number with D3 Library
         * @param Integer number
         * @returns {String}
         */
        $scope.formatNumber = function(number) {
            if(number <= 9) {
                return '.1s';
            } else if(number <= 99) {
                return '.2s';
            } else if(number >= 100 && number <= 999) {
                return '.3s';
            } else if(number > 999) {
                return '.2s';
            }
        };

        var oApiParam = {
            apiName: 'programCount',
            apiSuffix: '/'+$scope.currentYear,
            oParams: {}, 
            oData: {}, 
            method: 'GET'
        };

        //make api call to get count of programs
        ApiService.call(oApiParam).then(function(data){
            $scope.aProgramCount = {
                'new': d3.format($scope.formatNumber(parseInt(data.new)))(data.new),
                'archived': d3.format($scope.formatNumber(parseInt(data.archived)))(data.archived),
                'updated': d3.format($scope.formatNumber(parseInt(data.updated)))(data.updated)
            };
        });
}]);
})();