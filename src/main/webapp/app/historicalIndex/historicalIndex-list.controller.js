(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('HistoricalIndexListController', ['$scope', '$compile', 'appConstants', 'ApiService', 'FederalHierarchyService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$q', 'moment',
        function ($scope, $compile, appConstants, ApiService, FederalHierarchyService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $q, moment) {

            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers = appConstants.PAGE_ITEM_NUMBERS;
            $scope.previousState = null;
            $scope.historicalIndexSearch = $scope.historicalIndexSearch || {
                aChangeEvent: [],
                aStatus: [],
                aDateOfChange: [],
                organizationId: '-',
                betweenFromOpened: false,
                betweenToOpened: false
            };
            $scope.dictionary = {
                aChangeEvent: [
                    {
                        name: "program_number",
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
                aDateOfChange: [ //only last FY -> NEED TO FIX IT WITH CORRECT LAST FY
                    {
                        displayValue: "Since FY "+(moment().format('YYYY') - 1)+" Publication",
                        elementId: (moment().format('YYYY') - 1)
                    }
                ]
            };

            //setting for datepicker
            $scope.dateOptions = {
                formatYear: 'yy',
                showWeeks: false,
                startingDay: 1
            };

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

            //function for setting the popup when opened to it's field input
            $scope.openDatepicker = function ($event, openedInput) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.historicalIndexSearch[openedInput] = true;
            };

            $scope.searchHistoricalIndex = function () {
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
                console.log(data)
                var oApiParam = {
                    apiName: 'historicalIndexList',
                    apiSuffix: '',
                    oParams: {
                        limit: data['length'] || 10,
                        offset: data['start'],
                        includeCount: true,
                        oFilterParam: {}
                    },
                    oData: {},
                    method: 'GET'
                };

                if ($scope.historicalIndexSearch.keyword) {
                    oApiParam.oParams['keyword'] = $scope.historicalIndexSearch.keyword;
//                    oApiParam.oParams.offset = 0;
                }

                //apply agency custom search
                if ($scope.historicalIndexSearch.aChangeEvent.length > 0) {
                    oApiParam.oParams['oFilterParam'].aChangeEvent = $scope.historicalIndexSearch.aChangeEvent;
//                    oApiParam.oParams.offset = 0;
                }

                //apply Status custom search
                if ($scope.historicalIndexSearch.aStatus.length > 0) {
                    oApiParam.oParams['oFilterParam'].aStatus = $scope.historicalIndexSearch.aStatus;
//                    oApiParam.oParams.offset = 0;
                }

                //apply BetweenFrom  from custom search
                if ($scope.historicalIndexSearch.betweenFrom) {
                    oApiParam.oParams['oFilterParam'].from = moment($scope.historicalIndexSearch.betweenFrom).format('YYYY');
//                    oApiParam.oParams.offset = 0;
                }

                //apply BetweenTo from custom search
                if ($scope.historicalIndexSearch.betweenTo) {
                    oApiParam.oParams['oFilterParam'].to = moment($scope.historicalIndexSearch.betweenTo).format('YYYY');
//                    oApiParam.oParams.offset = 0;
                }

                //apply date of change from custom search
                if ($scope.historicalIndexSearch.aDateOfChange.length > 0) {
                    oApiParam.oParams['oFilterParam'].dateChange = $scope.historicalIndexSearch.aDateOfChange[0].elementId;
//                    oApiParam.oParams.offset = 0;
                }

                //apply organization from custom search
                if ($scope.historicalIndexSearch.organizationId !== '-') {
                    oApiParam.oParams['oFilterParam'].organizationId = $scope.historicalIndexSearch.organizationId;
                    oApiParam.oParams.offset = 0;
                }

                if (data['order']) {
                    var order = data['order'][0];
                    var columnName = data['columns'][order['column']]['data'];
                    if (columnName) {
                        oApiParam.oParams['sortBy'] = ( angular.equals(order['dir'], 'asc') ? '' : '-' ) + columnName;
                    }
                }

                ApiService.call(oApiParam).then(
                    function (d) {
                        console.log(d);
                        var results = d.results;


                        var promises = [];
                        var tableData = [];
                        angular.forEach(results, function (r) {
                            var row = {
                                'programId': r['programId'],
                                'title': {
                                    title: r['title'],
                                    id: r['programId'],
                                    activeLink: (r['latest'] && !r['archive'])
                                },
                                'organization': {'id': r['organizationId'], 'value': ''},
                                'programNumber': r['programNumber'],
                                'status': (r['archive']) ? 'Archived' : 'Active',
                                'historicalChanges': r['historicalChanges']
                            };
                            promises.push(FederalHierarchyService.getFederalHierarchyById(r['organizationId'], true, false, function (data) {
                                row['organization']['value'] = FederalHierarchyService.getFullNameFederalHierarchy(data);
                            }, function () {
                                row['organization']['value'] = 'Organization Not Found';
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

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('initComplete', function (settings, json) {
                    // Append info text for easier theming
                    $(".dataTables_info").appendTo(".dataTables_length label");
                    $(".dataTables_info").contents().unwrap();
                })
                .withOption('order', [[1, 'asc']])
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withOption('searching', false)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDataProp('data')
                .withDOM('<"usa-grid"r> <"usa-grid"t> <"usa-background-gray-lightest" <"usa-grid" <"usa-width-one-half"li> <"usa-width-one-half"p> > > <"clear">')
                .withOption('ajax', $scope.loadHistoricalIndex)
                .withOption('rowCallback', function (row) {
                    $compile(row)($scope);
                })
                .withLanguage({
                    'processing': '<div class="ui active small inline loader"></div> Loading',
                    'emptyTable': 'No Results Found',
                    'lengthMenu': 'Showing _MENU_ entries',
                    'info': ' of _TOTAL_ entries'
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
                DTColumnBuilder.newColumn('organization')
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
                    if(typeof row.data() !== 'undefined') {
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
                        html +=
                            '<tr>' +
                            '<td>' + row.fiscalYear + '</td>' +
                            '<td>' + row.actionType + '</td>' +
                            '<td>' + row.body + '</td>' +
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
