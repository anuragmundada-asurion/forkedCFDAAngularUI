(function () {
    "use strict";

    angular.module('app')
        .controller('HomeController', ['$scope', '$state', 'appConstants', 'ApiService', 'moment', 'SearchFactory', 'AuthorizationService', 'ROLES',
            function ($scope, $state, appConstants, ApiService, moment, SearchFactory, AuthorizationService, ROLES) {

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
                        return '02.1r';
                    } else if (number <= 99) {
                        return '.2r';
                    } else if (number >= 100 && number <= 999) {
                        return '.3r';
                    } else if (number > 999) {
                        return '.2r';
                    }
                };

                var oApiParam = {
                    apiName: 'programCountByYear',
                    apiSuffix: '/' + $scope.currentYear,
                    oParams: {},
                    oData: {},
                    method: 'GET'
                };

                //make api call to get count of programs
                ApiService.call(oApiParam).then(function (data) {
                    
                    var newSymbol = d3.formatPrefix(data.new);
                    var archivedSymbol = d3.formatPrefix(data.archived);
                    var updatedSymbol = d3.formatPrefix(data.updated);
                    
                    $scope.aProgramCount = {
                        'new': d3.format($scope.formatNumber(parseInt(data.new)))(newSymbol.scale(data.new)),
                        'newsymbol' : newSymbol.symbol,
                        'archived': d3.format($scope.formatNumber(parseInt(data.archived)))(archivedSymbol.scale(data.archived)),
                        'archivedsymbol': archivedSymbol.symbol,
                        'updated': d3.format($scope.formatNumber(parseInt(data.updated)))(updatedSymbol.scale(data.updated)),
                        'updatedsymbol' : updatedSymbol.symbol
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

                    //sort data descending order
                    $scope.chartData.sort(function (obj1, obj2) {
                        return (obj2.count - obj1.count);
                    });

                    $scope.makeHomePageChart();
                });


                /**
                 * Generate chart
                 * @returns void
                 */
                $scope.makeHomePageChart = function () {
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
                                height: 65,
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
                                    valueFormat = d3.format("d"),
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
                                     bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                                    //bgcolor = d[i].id ? extraColors[d[i].index] : color;

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

                //Dashboard feature
                if ($scope.user && AuthorizationService.authorizeByRole([ROLES.SUPER_USER, ROLES.AGENCY_COORDINATOR, ROLES.AGENCY_USER, ROLES.OMB_ANALYST, ROLES.GSA_ANALYST, ROLES.RMO_SUPER_USER, ROLES.LIMITED_SUPER_USER])) {
                    var oApiParam = {
                        apiName: 'programCount',
                        apiSuffix: '',
                        oParams: {},
                        oData: {},
                        method: 'GET'
                    };

                    //make api call to get count of programs
                    ApiService.call(oApiParam).then(function (data) {
                        $scope.oDashboardReport = {
                            active: parseInt((data.total_active_listing) ? data.total_active_listing : 0),
                            draft: parseInt((data.total_draft_listing) ? data.total_draft_listing : 0),
                            pending: parseInt((data.total_pending_listing) ? data.total_pending_listing : 0),
                            published: parseInt((data.total_published_listing) ? data.total_published_listing : 0),
                            rejected: parseInt((data.total_rejected_listing) ? data.total_rejected_listing : 0),
                            request: parseInt((data.total_request) ? data.total_request : 0)
                        };
                    });
                }
            }]);
})();