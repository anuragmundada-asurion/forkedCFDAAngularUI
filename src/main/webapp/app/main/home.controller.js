(function () {
    "use strict";

    angular.module('app')
        .controller('HomeController', ['$scope', '$state', 'appConstants', 'ApiService', 'moment', 'SearchFactory',
            function ($scope, $state, appConstants, ApiService, moment, SearchFactory) {

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

                //make eligiblisting api call
                var eligbParams = {
                    apiName: 'programEligibCount',
                    apiSuffix: '',
                    oParams: {},
                    oData: {},
                    method: 'GET'
                };
                $scope.eligibCount = {};

                ApiService.call(eligbParams).then(function (data) {
                    $scope.applicantTypeData = data;
                    $scope.chartData = [
                        {
                            name: 'Individual',
                            count: data.individual.count,
                            ids: data.individual.ids
                        },
                        {
                            name: 'Local',
                            count: data.local.count,
                            ids: data.local.ids
                        },
                        {
                            name: 'Nonprofit',
                            count: data.nonprofit.count,
                            ids: data.nonprofit.ids
                        },
                        {
                            name: 'State',
                            count: data.state.count,
                            ids: data.state.ids
                        },
                        {
                            name: 'U.S. Territories',
                            count: data.us_territories.count,
                            ids: data.us_territories.ids
                        },
                        {
                            name: 'Federally Recognized Indian Tribal Organizations',
                            count: data.frito.count,
                            ids: data.frito.ids
                        }
                    ];

                    //load chart
                    $scope.makeHomePageChart();
                });

                /**
                 * Generate chart
                 * @returns void
                 */
                $scope.makeHomePageChart = function () {
                    var extraColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

                    $scope.chart = c3.generate({
                        bindto: document.getElementById('listingsChart'),
                        data: {
                            type: 'bar',
                            json: $scope.chartData,
                            onclick: function (d) {

                                //Set advanced search criteria
                                SearchFactory.setSearchCriteria('', { aApplicantEligibility: $scope.chartData[d.index].ids.map(function(i){
                                        return { element_id: i };
                                    })
                                });

                                $state.go('searchPrograms', {}, {
                                    reload: true,
                                    inherit: false
                                });
                            },
                            keys: {
                                x: 'name',
                                value: ['count']
                            },
                            color: function (color, d) {
                                console.log(d)
                                // d will be 'id' when called for legends
                                var cnt = (d.value) % (extraColors.length);
                                return d.id && d.id === 'data' ? extraColors[d.index] : color;
                            }
                        },
                        bar: {
                            width: {
                                ratio: 0.75
                            }
                        },
                        axis: {
                            x: {
                                type: 'category',
                                label: 'Listing Category'
                            },
                            y: {
                                label: '# of Listings'
                            }
                        }
                    });

                    $scope.chart.legend.hide();
                };
            }]);
})();