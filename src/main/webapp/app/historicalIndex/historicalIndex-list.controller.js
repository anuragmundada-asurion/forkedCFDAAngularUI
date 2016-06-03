(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('HistoricalIndexListController', ['$scope', '$compile', 'appConstants', 'ApiService', 'FederalHierarchyService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$q',
        function ($scope, $compile, appConstants, ApiService, FederalHierarchyService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $q) {

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
                        name: "agencyChanged",
                        label: "Agency Changed"
                    },
                    {
                        name: "reinstated",
                        label: "Reinstated"
                    },
                    {
                        name: "titleChanged",
                        label: "Title Changed"
                    },
                    {
                        name: "archived",
                        label: "Archived"
                    },
                    {
                        name: "numberChanged",
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
                aDateOfChange: [
                    {
                        displayValue: "Since FY 2013 Publication",
                        elementId: "2013"
                    },
                    {
                        displayValue: "Since FY 2014 Publication",
                        elementId: "2014"
                    },
                    {
                        displayValue: "Since FY 2015 Publication",
                        elementId: "2015"
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

            /**
             * Function loading agencies
             * @returns Void
             * @param data
             * @param callback
             * @param settings
             */
            $scope.searchHistoricalIndex = function (data, callback, settings) {
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
                    oApiParam.oParams.offset = 0;
                }

                //apply agency custom search
                if ($scope.historicalIndexSearch.aChangeEvent.length > 0) {
                    oApiParam.oParams['oFilterParam'].aChangeEvent = $scope.historicalIndexSearch.aChangeEvent;
                    oApiParam.oParams.offset = 0;
                }

                //apply Status custom search
                if ($scope.historicalIndexSearch.aStatus.length > 0) {
                    oApiParam.oParams['oFilterParam'].aStatus = $scope.historicalIndexSearch.aStatus;
                    oApiParam.oParams.offset = 0;
                }

                //apply BetweenFrom  from custom search
                if ($scope.historicalIndexSearch.betweenFrom) {
                    oApiParam.oParams['oFilterParam'].from = $scope.historicalIndexSearch.betweenFrom;
                    oApiParam.oParams.offset = 0;
                }

                //apply BetweenTo from custom search
                if ($scope.historicalIndexSearch.betweenTo) {
                    oApiParam.oParams['oFilterParam'].to = $scope.historicalIndexSearch.betweenTo;
                    oApiParam.oParams.offset = 0;
                }

                //apply date of change from custom search
                if ($scope.historicalIndexSearch.aDateOfChange.length > 0) {
                    oApiParam.oParams['oFilterParam'].dateChange = $scope.historicalIndexSearch.aDateOfChange[0].elementId;
                    oApiParam.oParams.offset = 0;
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
                        var results = d.results;

                        results = [{
                            'programId': "222222",
                            'title': "rk test manual fal number outside the range",
                            'organizationId': "100500340",
                            'programNumber': "10.012",
                            'status': "Active",
                            'historicalChanges': [
                                {
                                    'year': '1965',
                                    'event': 'Created',
                                    'label': 'Agricultural Research Service'
                                },
                                {
                                    'year': '1981',
                                    'event': 'Title Changed',
                                    'label': 'Agricultural Research Service Basic Applied'
                                },
                                {
                                    'year': '2002',
                                    'event': 'Number Changed',
                                    'label': 'Agricultural Research Service Basic Applied'
                                },
                            ]
                        }, {
                            'programId': "3333",
                            'title': "Test fal number outside the range",
                            'organizationId': "100000391",
                            'programNumber': "20.015",
                            'status': "Archived",
                            'historicalChanges': [
                                {
                                    'year': '1978',
                                    'event': 'Created',
                                    'label': 'Agricultural Research Service'
                                },
                                {
                                    'year': '1991',
                                    'event': 'Title Changed',
                                    'label': 'Agricultural Research Service Basic Applied'
                                },
                                {
                                    'year': '2012',
                                    'event': 'Number Changed',
                                    'label': 'Agricultural Research Service Basic Applied'
                                },
                            ]
                        }];

                        var promises = [];
                        var tableData = [];
                        angular.forEach(results, function (r) {
                            var row = {
                                'programId': r['id'],
                                'title': r['title'],
                                'organization': {'id': r['organizationId'], 'value': ''},
                                'programNumber': r['programNumber'],
                                'status': r['status'],
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
                .withOption('ajax', $scope.searchHistoricalIndex)
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
                        return '<a ui-sref="viewProgram({id: \'66d1d2645f8acd25c2e79bb60b7342da\'})">' + data + '</a>';
                    }),
                DTColumnBuilder.newColumn('organization')
                    .withTitle('Department/Sub-Tier Agency & Office')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        console.log(data)
                        return data['value'];
                    }),
                DTColumnBuilder.newColumn('status').withTitle('Status').withOption('defaultContent', ''),
            ];

            //expand historical indexes by defaults
            angular.element('#historicalIndexTable').on('draw.dt', function (event, data) {
                $('#historicalIndexTable tbody tr').each(function () {
                    var tr = $(this);
                    var row = $scope.dtInstance.DataTable.row(tr);
                    // Open this row
                    row.child($scope.formatHistoricalIndex(row.data())).show();
                    tr.addClass('shown');
                });
            });

            /**
             * callback function to render historical indexes row to insert under the program row
             * @param {Object} d
             * @returns {String}
             */
            $scope.formatHistoricalIndex = function(d) {

              var html = '';

              var childData = document.createElement("tr");
              childData.setAttribute("style", "background-color: #eeeeee;");
              var spacingColumn = document.createElement("td");
              spacingColumn.colSpan="2";
              spacingColumn.setAttribute("style", "border-right: 1px solid #ddd;");
              var dataColumn = document.createElement("td");
              dataColumn.colSpan="3";

              var childDataTable = document.createElement("table");
              childDataTable.className = "usa-table-child";

              angular.forEach(d.historicalChanges, function(row){
                  html +=
                  '<tr>'+
                      '<td>'+row.year+'</td>'+
                      '<td>'+row.event+'</td>'+
                      '<td>'+row.label+'</td>'+
                  '</tr>';
              });

                childDataTable.innerHTML = html;
                dataColumn.appendChild(childDataTable);

                childData.appendChild(spacingColumn);
                childData.appendChild(dataColumn);

                return childData;
            };
        }]);
})();