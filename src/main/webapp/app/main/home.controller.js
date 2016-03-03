(function () {
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
                $scope.formatNumber = function (number) {
                    if (number <= 9) {
                        return '.1s';
                    } else if (number <= 99) {
                        return '.2s';
                    } else if (number >= 100 && number <= 999) {
                        return '.3s';
                    } else if (number > 999) {
                        return '.2s';
                    }
                };

                var oApiParam = {
                    apiName: 'programCount',
                    apiSuffix: '/' + $scope.currentYear,
                    oParams: {},
                    oData: {},
                    method: 'GET'
                };

                //make api call to get count of programs
                ApiService.call(oApiParam).then(function (data) {
                    $scope.aProgramCount = {
                        'new': d3.format($scope.formatNumber(parseInt(data.new)))(data.new),
                        'archived': d3.format($scope.formatNumber(parseInt(data.archived)))(data.archived),
                        'updated': d3.format($scope.formatNumber(parseInt(data.updated)))(data.updated)
                    };
                });


                //make chart
                $scope.chart = c3.generate({
                    bindto: document.getElementById('listingsChart'),
                    data: {
                        json: [{
                            name: 'Individual',
                            total: 400
                        }, {
                            name: 'Local',
                            total: 400
                        }, {
                            name: 'Nonprofit',
                            total: 500
                        }, {
                            name: 'State',
                            total: 5000
                        }, {
                            name: 'U.S. Territories',
                            total: 100
                        }, {
                            name: 'Federally Recognized Indian Tribal Organizations',
                            total: 800
                        }
                        ],
                        keys: {
                            x: 'name', // it's possible to specify 'x' when category axis
                            value: ['total']
                        },
                        type: 'bar'
                    },
                    bar: {
                        width: {
                            ratio: 0.55
                        }
                        // or
                        //width: 100 // this makes bar width 100px
                    },
                    axis: {
                        x: {
                            type: 'category',
                            label: 'Listing Category'
                        },
                        y: {
                            label: '# of Listings'
                        },
                    }

                });

                $scope.chart.legend.hide();
            }]);
})();