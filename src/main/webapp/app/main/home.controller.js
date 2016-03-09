(function () {
    "use strict";

    angular.module('app')
        .controller('HomeController', ['$rootScope', '$scope', 'appConstants', 'ApiService', 'moment', '$state',
            function ($rootScope, $scope, appConstants, ApiService, moment, $state) {

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
                    apiSuffix: '/',
                    oParams: {},
                    oData: {},
                    method: 'GET'
                };
                $scope.eligibCount = {};

                ApiService.call(eligbParams).then(function (data) {
                    $scope.applicantTypeData = data;
                    $scope.eligibCount = {
                        'individual': data.individual.count,
                        'local': data.local.count,
                        'nonprofit': data.nonprofit.count,
                        'state': data.state.count,
                        'us_territories': data.us_territories.count,
                        'frito': data.frito.count,
                    };

                    //load chart
                    $scope.makeHomePageChart();
                });

                /**
                 * Generate chart
                 * @returns void
                 */
                $scope.makeHomePageChart = function () {
                    var extraColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];
                    //things that are searched for when a bar is clicked on
                    var searchCriteria = ['Individual', 'Local', 'Nonprofit', 'State', 'U.S. Territories', 'Federally Recognized Indian Tribal Organizations'];
                    $scope.chart = c3.generate({
                        bindto: document.getElementById('listingsChart'),
                        data: {
                            type: 'bar',
                            onclick: function (d) {
                                $scope.globalSearchValue = searchCriteria[d.index];
                                $rootScope['globalSearchValue'] = $scope['globalSearchValue'];
                                $state.go('searchPrograms', {keyword: $scope.globalSearchValue}, {
                                    reload: true,
                                    inherit: false
                                });
                            },
                            x: 'x',
                            columns: [
                                ['x', 'Individual', 'Local', 'Nonprofit', 'State', 'U.S. Territories', 'Federally Recognized Indian Tribal Organizations'],
                                ['data', $scope.eligibCount.individual, $scope.eligibCount.local, $scope.eligibCount.nonprofit, $scope.eligibCount.state, $scope.eligibCount.us_territories, $scope.eligibCount.frito]
                            ],
                            color: function (color, d) {
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