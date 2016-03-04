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


                //gonna get data for 2014
                console.log("A. get data for 2014");

                $scope.year2 = new moment().subtract(2, 'year').format('YYYY');
                console.log('year2 is : ' + $scope.year2);

                var apiParams2 = {
                    apiName: 'programCount',
                    apiSuffix: '/' + $scope.year2,
                    oParams: {},
                    oData: {},
                    method: 'GET'
                };

                console.log('apiParams2:');
                console.log(apiParams2);
                $scope.programCount2 = {
                    'new': 212,
                    'archived': 112,
                    'updated': 423
                };
                console.log('about to call api service to make a call to this app\'s backend');
                ApiService.call(apiParams2).then(function (data) {
                    console.log('after the api call was made, the returned data: ' + data);
                    $scope.programCount2 = {
                        'new': d3.format($scope.formatNumber(parseInt(data.new)))(data.new),
                        'archived': d3.format($scope.formatNumber(parseInt(data.archived)))(data.archived),
                        'updated': d3.format($scope.formatNumber(parseInt(data.updated)))(data.updated)
                    };
                    console.log("program count:");
                    console.log($scope.programCount2);
                });

                console.log("Z. get data for 2014");

                console.log($scope.programCount2);

                //make chart
                $scope.chart = c3.generate({
                    bindto: document.getElementById('listingsChart'),
                    data: {
                        json: [
                            {
                                name: 'New',
                                total: $scope.programCount2.new
                            }, {
                                name: 'Archived',
                                total: $scope.programCount2.archived
                            }, {
                                name: 'Updated',
                                total: $scope.programCount2.updated
                            }





                        //    {
                        //    name: 'Individual',
                        //    total: 400
                        //}, {
                        //    name: 'Local',
                        //    total: 400
                        //}, {
                        //    name: 'Nonprofit',
                        //    total: 500
                        //}, {
                        //    name: 'State',
                        //    total: 5000
                        //}, {
                        //    name: 'U.S. Territories',
                        //    total: 100
                        //}, {
                        //    name: 'Federally Recognized Indian Tribal Organizations',
                        //    total: 800
                        //}
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