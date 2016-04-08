(function () {
    "use strict";

    angular.module('app')
        .controller('HomeController', ['$scope', '$state', 'appConstants', 'ApiService', 'moment', 'SearchFactory', 'AuthorizationService', 'ROLES', '$timeout',
            function ($scope, $state, appConstants, ApiService, moment, SearchFactory, AuthorizationService, ROLES, $timeout) {

                angular.extend($scope, {
                    itemsByPage: appConstants.DEFAULT_PAGE_ITEM_NUMBER,
                    itemsByPageNumbers: appConstants.PAGE_ITEM_NUMBERS,
                    currentYear: new moment().format('YYYY'),

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
                    if(number === 0)
                        return '';

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
                        'newNumber' : data.new,
                        'archived': d3.format($scope.formatNumber(parseInt(data.archived)))(archivedSymbol.scale(data.archived)),
                        'archivedsymbol': archivedSymbol.symbol,
                        'archivedNumber': data.archived,
                        'updated': d3.format($scope.formatNumber(parseInt(data.updated)))(updatedSymbol.scale(data.updated)),
                        'updatedsymbol' : updatedSymbol.symbol,
                        'updatedNumber': data.updated
                    };
                });

                /**
                 * Generate chart
                 * @returns void
                 */

                $scope.makeHomePageChart = function () {
                    $timeout(function() {
                        var colors = ['#25A148', '#F16B22', '#1776B6', '#FAB915', '#8F65AA', '#8D5649'];

                        $scope.chart = c3.generate({
                            bindto: document.getElementById('listingsChart'),
                            transition: {
                                duration: 400
                            },
                            size: {
                                height: 260
                            },
                            data: {
                                type: 'bar',
                                mimeType: 'json',
                                url: '/api/eligibilitylistings',
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
                                    return colors[d.index];
                                }
                            },
                            legend: {
                                show: false
                            },
                            bar: {
                                width: 50
                            },
                            grid:{
                                focus:{
                                    show: false
                                }
                            },
                            axis: {
                                x: {
                                    height: 35,
                                    type: 'category',
                                    label: {
                                        text: 'Listing Category',
                                        position: 'outer-center'
                                    },
                                    tick: {
                                        outer: false,
                                        culling: true
                                    }
                                },
                                y: {
                                    label: {
                                        text: '# of Listings',
                                        position: 'outer-middle'
                                    },
                                    tick: {
                                        outer: false,
                                        count: 6,
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
                                        valueFormat = d3.format(".2s"),
                                        text, i, title, value, name, bgcolor;


                                    for (i = 0; i < d.length; i++) {

                                        if (!(d[i] && (d[i].value || d[i].value === 0))) {
                                            continue;
                                        }

                                        name = nameFormat(d[i].name);
                                        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                                        bgcolor = colors[d[i].index];

                                        if (!text) {
                                            title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                                            text = "<div style='border-color:" + bgcolor + "' class='ui circular label outline filled big " + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<div><span style='font-weight: 300; '>" + value + "</span><span style='display: block; width: 60px; font-size: 14px; text-align: center; line-height: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0; margin-top: -5px;'>"  + title + "</span></div>" : "");
                                        }

                                        // text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                                        //text += "<div>" + value + "</div>";
                                    }
                                    return text + "</div>";
                                }
                            }
                        });
                    }, 1000);
                }();

                /**
                 * Go to search result prefiltered with Publication (New or Updated) of this year
                 * @returns void
                 */
                $scope.searchByListingPublication = function(type) {
                    //Set advanced search criteria
                    SearchFactory.setSearchCriteria('', {
                        publicationListingType: type
                    });

                    $state.go('searchPrograms', {}, {
                        reload: true,
                        inherit: false
                    });
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