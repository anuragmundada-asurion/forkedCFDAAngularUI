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
                    $scope.chartData = data;
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
                                SearchFactory.setSearchCriteria('', {
                                    aApplicantEligibility: $scope.chartData[d.index].ids.map(function (i) {
                                        return {element_id: i};
                                    })
                                });

                                $state.go('searchPrograms', {}, {
                                    reload: true,
                                    inherit: false
                                });
                            },
                            keys: {
                                x: 'label',
                                value: ['count']
                            },
                            color: function (color, d) {
                                return d.id ? extraColors[d.index] : color;
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
                                height: 50,
                                label: {
                                    text: 'Listing Category',
                                    position: 'outer-center',

                                },
                                tick: {
                                    culling: false
                                }
                            },
                            y: {
                                height: 100,
                                label: {
                                    text: '# of Listings',
                                    position: 'outer-middle'
                                },
                                tick: {
                                    count: 9,
                                    format: d3.format('.2s')
                                }


                            }
                        },
                        tooltip: {
                            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                                var $$ = this,
                                    config = $$.config,
                                    titleFormat = config.tooltip_format_title || defaultTitleFormat,
                                    nameFormat = config.tooltip_format_name || function (name) {
                                            return name;
                                        },
                                    valueFormat = config.tooltip_format_value || defaultValueFormat,
                                    text, i, title, value, name, bgcolor;
                                for (i = 0; i < d.length; i++) {
                                    if (!(d[i] && (d[i].value || d[i].value === 0))) {
                                        continue;
                                    }

                                    if (!text) {
                                        title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                                        text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                                    }

                                    name = nameFormat(d[i].name);
                                    value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                                    // bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                                    bgcolor = d[i].id ? extraColors[d[i].index] : color;

                                    text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                                    text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + "</td>";
                                    text += "<td class='value'>" + value + "</td>";
                                    text += "</tr>";
                                }
                                return text + "</table>";
                            }
                        }
                    });

                    $scope.chart.legend.hide();
                };
            }]);
})();