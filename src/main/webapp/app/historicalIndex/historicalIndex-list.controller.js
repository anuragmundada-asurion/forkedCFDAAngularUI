(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('HistoricalIndexListController', ['$scope', '$rootScope', '$compile', '$stateParams', 'appConstants', 'ApiService', 'FederalHierarchyService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$q', 'moment', 'AuthorizationService', 'ROLES',
        function ($scope, $rootScope, $compile, $stateParams, appConstants, ApiService, FederalHierarchyService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $q, moment, AuthorizationService, ROLES) {

            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers = appConstants.PAGE_ITEM_NUMBERS;
            $scope.previousState = null;

            //this uses the static data in $scope.dictionary.aChangeEvent
            $scope.getActionLabel = function (name) {
                var actionObj = _.filter($scope.dictionary.aChangeEvent, {'name': name})[0];
                if (name === "publish") {
                    return "Published";
                }
                return actionObj.label;
            };

            /**
             * initialize form
             * @returns void
             */
            $scope.initSearchForm = function (reloadSearchResult) {
                $scope.historicalIndexSearch = {
                    aChangeEvent: [],
                    aStatus: ($stateParams.hasOwnProperty('status') && typeof $stateParams.status !== 'undefined') ? [$stateParams.status] : [],
                    currentCalendarYear: ($stateParams.hasOwnProperty('currentCalendarYear') && typeof $stateParams.currentCalendarYear !== 'undefined') ? true : false,
                    organizationId: '-',
                    betweenFrom: [],
                    betweenTo: []
                };

                $scope.dictionary = {
                    aChangeEvent: [
                        {
                            name: "agency",
                            label: "Agency Changed"
                        },
                        {
                            name: "unarchive",
                            label: "Reinstated"
                        },
                        {
                            name: "title",
                            label: "Title Changed"
                        },
                        {
                            name: "archived",
                            label: "Archived"
                        },
                        {
                            name: "program_number",
                            label: "Number Changed"
                        }
                    ],
                    aStatus: [
                        {
                            name: "active",
                            label: "Active"
                        },
                        {
                            name: "archived",
                            label: "Archived"
                        }
                    ],
                    aYearFrom: _.range(1960, parseInt(moment().format('YYYY')) + 1, 1).map(function (i) {
                        return {"elementId": i, "displayValue": i};
                    }),
                    aYearTo: _.range(1960, parseInt(moment().format('YYYY')) + 1, 1).map(function (i) {
                        return {"elementId": i, "displayValue": i};
                    })
                };

                if (reloadSearchResult === true) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            };

            //init search form
            $scope.initSearchForm(false);

            $('.usa-cfda-accordion').each(function () {
                new CommonUtility.AccordionCFDA($(this));
            });

            /**
             *
             * @param String name
             * @param String field
             * @returns Void
             */
            $scope.toggleSelection = function (name, field) {
                var idx = $scope.historicalIndexSearch[field].indexOf(name);

                // is currently selected
                if (idx > -1) {
                    $scope.historicalIndexSearch[field].splice(idx, 1);
                }
                // is newly selected
                else {
                    $scope.historicalIndexSearch[field].push(name);
                }
            };

            //search on enter also
            $scope.searchKeyUp = function (keycode) {
                if (keycode === 13) {
                    $scope.searchHistoricalIndex();
                }
            };

            $scope.searchHistoricalIndex = function () {
                //force a click on collapsible-0 to hide advanced search if its open
                if ($("#advancedsearchbutton").attr("aria-expanded") === "true") {
                    $("#advancedsearchbutton").trigger("click");
                }
                $scope.dtInstance.DataTable.ajax.reload();
            };

            /**
             * Function loading agencies
             * @returns Void
             * @param data
             * @param callback
             * @param settings
             */
            $scope.loadHistoricalIndex = function (data, callback, settings) {
                var oApiParam = {
                    apiName: 'historicalIndexList',
                    apiSuffix: '',
                    oParams: {
                        size: data['length'] || 10,
                        oFilterParam: {}
                    },
                    oData: {},
                    method: 'GET'
                };

                if (data['start']) {
                    oApiParam.oParams["page"] = Math.ceil(data['start'] / oApiParam.oParams.size);
                }

                if ($scope.historicalIndexSearch.keyword) {
                    oApiParam.oParams['keyword'] = $scope.historicalIndexSearch.keyword;
                }

                //apply agency custom search
                if ($scope.historicalIndexSearch.aChangeEvent.length > 0) {
                    oApiParam.oParams['oFilterParam'].aChangeEvent = $scope.historicalIndexSearch.aChangeEvent;
                }

                //apply Status custom search
                if ($scope.historicalIndexSearch.aStatus.length > 0) {
                    oApiParam.oParams['oFilterParam'].aStatus = $scope.historicalIndexSearch.aStatus;
                }

                //apply BetweenFrom  from custom search
                if ($scope.historicalIndexSearch.betweenFrom.length > 0) {
                    oApiParam.oParams['oFilterParam'].from = $scope.historicalIndexSearch.betweenFrom[0].elementId;
                }

                //apply BetweenTo from custom search
                if ($scope.historicalIndexSearch.betweenTo.length > 0) {
                    oApiParam.oParams['oFilterParam'].to = $scope.historicalIndexSearch.betweenTo[0].elementId;
                }

                //apply date of change from custom search
                if ($scope.historicalIndexSearch.currentCalendarYear) {
                    oApiParam.oParams['oFilterParam'].dateChange = moment().format('YYYY'); //current calendar year
                }

                //apply organization from custom search
                if ($scope.historicalIndexSearch.organizationId !== '-') {
                    oApiParam.oParams['oFilterParam'].organizationId = $scope.historicalIndexSearch.organizationId;
                }

                if (data['order'].length > 0) {
                    var order = data['order'][0];
                    var columnName = data['columns'][order['column']]['data'];
                    if (columnName) {
                        oApiParam.oParams['sortBy'] = ( angular.equals(order['dir'], 'asc') ? '' : '-' ) + columnName;
                    }
                }

                ApiService.call(oApiParam).then(function (d) {
                        var results = d.results;

                        //make sure the historical index results are sorted by fiscal year
                        results = _.map(results, function (result) {
                            //sort the results historical changes array, and put it back in result.historicalChanges
                            result.historicalChanges = _.sortBy(result.historicalChanges, ['index']);
                            return result;
                        });

                        var promises = [];
                        var tableData = [];
                        angular.forEach(results, function (r) {
                            var row = {
                                'programId': r['programId'],
                                'title': {
                                    title: r['title'],
                                    id: r['programId'],
                                    activeLink: ((r['latest'] && !r['archive']) || (r['latest'] && r['archive'] && AuthorizationService.authorizeByOrganization(r['organizationId'])))
                                },
                                'organizationId': {'id': r['organizationId'], 'value': ''},
                                'programNumber': r['programNumber'],
                                'status': (r['archive'] && r['latest']) ? 'Archived' : ((!r['archive'] && r['latest']) ? 'Active' : 'Past Version'),
                                'historicalChanges': r['historicalChanges']
                            };
                            promises.push(FederalHierarchyService.getFederalHierarchyById(r['organizationId'], true, false, function (data) {
                                row['organizationId']['value'] = FederalHierarchyService.getFullNameFederalHierarchy(data);
                            }, function () {
                                row['organizationId']['value'] = 'Organization Not Found';
                            }));

                            tableData.push(row);
                        });

                        $q.all(promises).then(function () {
                            callback({
                                "draw": parseInt(data['draw']) + 1,
                                "recordsTotal": d['totalCount'],
                                "recordsFiltered": d['totalCount'],
                                "data": tableData
                            });
                        });
                    }
                );
            };

            $scope.dtInstance = {};

            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withOption('sWidth', '20%')
            ];

            angular.element('#historicalIndexTable').on('draw.dt', function (event, data) {
                $compile(angular.element('.dataTables_length'))($scope);
                $scope.totalCount = data._iRecordsTotal;
            });

            // Adding table loading state
            angular.element('table.usa-table-primary-darkest').on('processing.dt', function (e, settings, processing) {
                $('table.usa-table-primary-darkest, .datatable-bottom').addClass(processing ? 'datatable-loading' : '');
                $('table.usa-table-primary-darkest, .datatable-bottom').removeClass(processing ? '' : 'datatable-loading');
            });


            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('initComplete', function (settings, json) {
                    // Append info text for easier theming
                    $(".dataTables_info").appendTo(".dataTables_length label");
                    $(".dataTables_info").contents().unwrap();
                })
                .withOption('order', [])
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withOption('searching', false)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDataProp('data')
                .withOption('info', false)
                .withDOM('<"usa-grid"r> <"usa-grid"t> <"usa-background-gray-lightest datatable-bottom" <"usa-grid" <"usa-width-one-half"li> <"usa-width-one-half"p> > > <"clear">')
                .withOption('ajax', $scope.loadHistoricalIndex)
                .withOption('rowCallback', function (row) {
                    $compile(row)($scope);
                })
                .withLanguage({
                    'processing': '<div class="ui active small inline loader"></div> Loading',
                    'emptyTable': 'No Results Found',
                    'lengthMenu': 'Showing _MENU_ entries of {{totalCount}} entries'
                });
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('empty').withTitle('').withOption('defaultContent', '').withOption('sWidth', '50px').withOption('orderable', false),
                DTColumnBuilder.newColumn('programNumber').withTitle('FAL#').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('title').withTitle('Title').withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        //only show title as active link if its not suppposed to be disabled
                        if (data.activeLink) {
                            return '<a ui-sref="viewProgram({id: \'' + data.id + '\'})">' + data.title + '</a>';
                        } else {
                            return '<span>' + data.title + '</span>';
                        }
                    }),
                DTColumnBuilder.newColumn('organizationId')
                    .withTitle('Department/Sub-Tier Agency & Office')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        return data['value'];
                    }),
                DTColumnBuilder.newColumn('status').withTitle('Status').withOption('defaultContent', ''),
            ];

            //expand historical indexes by defaults
            angular.element('#historicalIndexTable').on('draw.dt', function (event, data) {
                $('#historicalIndexTable tbody tr').each(function () {
                    var tr = $(this);
                    var row = $scope.dtInstance.DataTable.row(tr);
                    if (typeof row.data() !== 'undefined') {
                        // Open this row
                        row.child($scope.formatHistoricalIndex(row.data())).show();
                        tr.addClass('shown');
                    }
                });
            });

            /**
             * callback function to render historical indexes row to insert under the program row
             * @param {Object} d
             * @returns {String}
             */
            $scope.formatHistoricalIndex = function (d) {

                var html = '';

                var childData = document.createElement("tr");
                childData.setAttribute("style", "background-color: #eeeeee;");
                var spacingColumn = document.createElement("td");
                spacingColumn.colSpan = "2";
                spacingColumn.setAttribute("style", "border-right: 1px solid #ddd;");
                var dataColumn = document.createElement("td");
                dataColumn.colSpan = "3";

                var childDataTable = document.createElement("table");
                childDataTable.className = "usa-table-child";

                if (d.hasOwnProperty('historicalChanges')) {
                    angular.forEach(d.historicalChanges, function (row) {

                        var editIcon, description;
                        var actionLabel = $scope.getActionLabel(row.actionType);

                        //only show links if signed in as super user
                        if ($rootScope.hasRole([$rootScope.ROLES.SUPER_USER])) {
                            editIcon = $compile('<a class="usa-button usa-button-compact" ui-sref="editHistoricalIndex({hid: \'' + row.historicalIndexId + '\', pid: \'' + d.programId + '\'})">' + '<span class="fa fa-pencil"></span></a>')($scope);
                            description = $compile('<a ui-sref="viewHistoricalIndex({hid: \'' + row.historicalIndexId + '\', pid: \'' + d.programId + '\'})">' + row.body + '</a>')($scope);
                        } else {
                            editIcon = $compile('<span></span>')($scope);
                            description = $compile('<span>' + row.body + '</span>')($scope);
                        }

                        html +=
                            '<tr>' +
                            '<td>' + row.fiscalYear + ((row.statusCode !== null && row.statusCode !== '') ? ' (' + row.statusCode + ')' : '') + '</td>' +
                            '<td>' + actionLabel + '</td>' +
                            '<td>' + ((row.actionType !== 'archived') ? (description[0].outerHTML) : '') + '</td>' +
                            '<td>' + editIcon[0].outerHTML + '</td>' +
                            '</tr>';
                    });
                }

                childDataTable.innerHTML = html;
                dataColumn.appendChild(childDataTable);

                childData.appendChild(spacingColumn);
                childData.appendChild(dataColumn);

                return childData;
            };
        }]);
})();
