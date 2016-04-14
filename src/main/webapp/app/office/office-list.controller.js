(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('RegionalOfficeListController', ['$scope', '$log', '$timeout', '$http', 'appConstants', 'ApiService', 'Dictionary', 'FederalHierarchyService', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$q',
        function ($scope, $log, $timeout, $http, appConstants, ApiService, Dictionary, FederalHierarchyService, UserService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $q) {
            //needed for ng-jstree plugin
            var vm = this;


            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers = appConstants.PAGE_ITEM_NUMBERS;
            $scope.dictionary = {};
            $scope.filter = {
                aDivision: [],
                aAgency: []
            };
            $scope.searchKeyword = '';
            $scope.previousState = null;
            var aDictionay = ['regional_office_division', 'states'];

            var userOrgId = UserService.getUserOrgId();
            if (userOrgId) {
                FederalHierarchyService.getFederalHierarchyById(UserService.getUserOrgId(), true, true, function (oData) {
                    $scope.dictionary.aAgency = [FederalHierarchyService.dropdownDataStructure(oData, [])];

                });


                //START --- js tree stuff
                //------------------------------------------------------------------------------------

                FederalHierarchyService.getChildren(UserService.getUserOrgId(), 1, function (oData) {

                    //format expects an array. thats why we converted the obj to an array
                    var formattedData = formatAgencyData([oData]);
                    console.log('fh data', formattedData);
                    $scope.treeData = formattedData;
                    instantiateTree();
                    console.log("instantiate Tree finished!");


                });

                //------------------------------------------------------------------------------------
                //END --- js tree stuff


            }

            // START --- js tree stuff
            //------------------------------------------------------------------------------------
            $scope.call = function (oApiParam) {
                var deferred = $q.defer();

                $http({
                    'method': oApiParam.method,
                    'url': oApiParam.url,
                    'params': oApiParam.oParams,
                    'data': oApiParam.oData
                })
                    .success(function (data) {
                        deferred.resolve(data);
                    }).error(function (msg, code) {
                        deferred.reject(msg);
                        $log.error(msg, code);
                    });

                return deferred.promise;
            };

            function formatAgencyData(dataArray) {
                var keyMapping = {
                    "hierarchy": "children",
                    "name": "text",
                    "sourceOrgId": "id"
                };

                var formattedData = _.map(dataArray, function (currentObj) {
                    var tmpObj = {};
                    for (var property in currentObj) {
                        //do recursion
                        if (property == "hierarchy") {
                            currentObj.hierarchy = formatAgencyData(currentObj.hierarchy);
                        }

                        //rename keys
                        if (keyMapping.hasOwnProperty(property)) {
                            tmpObj[keyMapping[property]] = currentObj[property];
                        } else {
                            tmpObj[property] = currentObj[property];
                        }
                    }
                    return tmpObj;
                });


                return formattedData;
            }


            //callbacks --
            $scope.treeEventsObj = {
                'changed': changedNodeCB,
                'ready': readyCB

            };

            function readyCB() {
                console.log("readyCB fired!");
                //$timeout(function() {
                //
                //    $scope.$watch('searchText', function() {
                //        console.log('hey, searchText was changed', $scope.searchText);
                //        console.log('$scope: ', $scope);
                //        console.log('$scope treeInstance23: ', $scope.treeInstance23);
                //        var q = ($scope.searchText) ? $scope.searchText : '';
                //        vm.treeInstance23.jstree(true).search(q);
                //    });
                //});
            };

            function changedNodeCB(e, data) {
                console.log("changedNodeCB fired!");
                console.log("--------------");
                console.log("event fired e: ", e);
                console.log("event fired data: ", data);
                console.log("treeData2: ", $scope.treeData);


                var node = data.node;
                //only make ajax call if data currently does not have children, dont make calls for stuff thats already loaded
                //THIS MIGHT BE NOT CORRECT TO DO.. REVISIT THIS LATER..
                if (!node.children || node.children.length == 0) {
                    var elementId = node.original.elementId;
                    var parentId = node.original.id;


                    //make api call, get data, put it under the correct parent
                    var gotoUrl = 'http://192.168.56.103:8080/api/federalHierarchies/' + elementId + '?childrenLevels=1';
                    var params = {
                        // url: 'http://gsaiae-cfda-fh-dev02.reisys.com/v1/fh/100011942?childrenLevels=1',
                        url: gotoUrl,
                        apiSuffix: '',
                        oParams: {},
                        oData: {},
                        method: 'GET'
                    };
                    //this data argument is local to this function
                    $scope.call(params).then(function (data) {
                        var parentId = node.original.id;
                        if (data.hierarchy && data.hierarchy.length > 0) {
                            //grab the children, already an array. so dont need to convert ot an array
                            var formattedData = formatAgencyData(data.hierarchy);
                            _.forEach(formattedData, function (value, key, collection) {
                                value.parent = parentId;
                                $scope.treeData.push(value);
                            });

                        } else {
                            console.log("no children!!!! --");
                        }

                    });


                    //FederalHierarchyService.getChildren(elementId, 1, function (oData) {
                    //    if (oData.hierarchy && oData.hierarchy.length > 0) {
                    //        console.log("called fh, clicked thing has children: ", oData);
                    //        //grab the children, already an array. so dont need to convert ot an array
                    //        var formattedData = formatAgencyData(oData.hierarchy);
                    //        console.log("clicked thing formatted children: ", oData.hierarchy);
                    //
                    //        _.forEach(formattedData, function (value, key, collection) {
                    //            value.parent = parentId;
                    //            $scope.treeData.push(value);
                    //            console.log("child pushed onto scope: $scope.treeData:", $scope.treeData.);
                    //        });
                    //
                    //    } else {
                    //        console.log("no children!!!! --");
                    //    }
                    //});


                } else {
                    console.log("already have children loaded!!");
                }
            }


            function instantiateTree() {
                console.log('inside instantiateTree, treeData:', $scope.treeData);
                $scope.treeConfig = {
                    core: {
                        multiple: true,
                        animation: true,
                        error: function (error) {
                            $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                        },
                        check_callback: true,
                        worker: true
                    },
                    types: {
                        default: {
                            icon: 'building icon'
                        },
                        DEPARTMENT: {
                            icon: 'university icon'
                        },
                        AGENCY: {
                            icon: 'home icon'
                        },
                        OFFICE: {
                            icon: 'tree icon'
                        }
                    },
                    version: 1,
                    checkbox: {
                        // cascade: 'up'
                        three_state: false
                    },
                    plugins: ['types', 'checkbox', 'search']
                };
            }


            //------------------------------------------------------------------------------------
            //END --- js tree stuff

            Dictionary.toDropdown({ids: aDictionay.join(',')}).$promise.then(function (data) {
                $scope.dictionary.aDivision = data.regional_office_division;
                $scope.dictionary.aStates = data.states;
            });

            //Group by filter for the Agency ui-select list.
            $scope.multiPickerGroupByFn = function (item) {
                return !!item.parent ? item.parent.value : item.value;
            };

            /**
             * Function loading agencies
             * @returns Void
             * @param data
             * @param callback
             * @param settings
             */
            $scope.loadAgencies = function (data, callback, settings) {
                var oApiParam = {
                    apiName: 'regionalOfficeList',
                    apiSuffix: '',
                    oParams: {
                        limit: data['length'] || 10,
                        offset: data['start'],
                        includeCount: true
                    },
                    oData: {},
                    method: 'GET'
                };

                if ($scope.searchKeyword) {
                    oApiParam.oParams['keyword'] = $scope.searchKeyword;
                    oApiParam.oParams.offset = 0;
                }

                //apply agency custom search
                if ($scope.filter.aAgency.length > 0 || $scope.filter.aDivision.length > 0) {
                    oApiParam.oParams['oFilterParam'] = $scope.prepareDataStructure($scope.filter);
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
                        var promises = [];
                        var tableData = [];
                        angular.forEach(results, function (r) {
                            var row = {
                                'id': r['id'],
                                'agency': {'id': r['agencyId'], 'officeId': r['id']},
                                'street': r['address']['street'],
                                'city': r['address']['city'],
                                'state': r['address']['state'],
                                'phone': r['phone']
                            };
                            promises.push(FederalHierarchyService.getFederalHierarchyById(r['agencyId'], true, false, function (data) {
                                row['agency']['value'] = FederalHierarchyService.getFullNameFederalHierarchy(data);
                            }, function () {
                                row['agency']['value'] = 'Organization Not Found';
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

            //Automatically loadAgencies if Filter scope has changed
            $scope.$watch('filter', function () {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            }, true);

            $scope.$watch('searchKeyword', function () {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            }, true);

            /**
             * prepare  data structure to send to regionalOffices API as parameters
             * @param Object oData
             * @returns Object
             */
            $scope.prepareDataStructure = function (oData) {
                var aArray = ['aDivision', 'aAgency'];
                var oResult = {};

                //loop through each filter
                angular.forEach(aArray, function (element) {
                    if (oData.hasOwnProperty(element)) {
                        angular.forEach(oData[element], function (row) {
                            if (oResult.hasOwnProperty(element)) {
                                oResult[element].push((row.hasOwnProperty('elementId')) ? row.elementId : row.element_id);
                            } else {
                                oResult[element] = [(row.hasOwnProperty('elementId')) ? row.elementId : row.element_id];
                            }
                        });
                    }
                });

                return oResult;
            };

            $scope.dtInstance = {};

            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withOption('sWidth', '20%')
            ];

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withOption('searching', false)
                .withDataProp('data')
                .withOption('ajax', $scope.loadAgencies)
                .withLanguage({
                    'emptyTable': 'No Agencies Found'
                });
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('agency')
                    .withTitle('Department/Sub-Tier Agency & Office')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        return '<a has-access="{{[PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE]}}" href="/regionalOffice/' + data['officeId'] + '/view">' + data['value'] + '</a>';
                    }),
                DTColumnBuilder.newColumn('street').withTitle('Street').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('city').withTitle('City').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('state').withTitle('State').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('phone').withTitle('Phone').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('action').withTitle('Action')
                    .withOption('data', null)
                    .withOption('defaultContent', '<a has-access="{{[PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE]}}" ui-sref="editRegionalOffice({id: row.id})"><button type="button"><span class="fa fa-pencil"></span></button></a><a ui-sref="viewRegionalOffice({id: row.id})"><button type="button"><span class="fa fa-file-text-o"></span></button></a>')
                    .withOption('orderable', false)
            ];
        }]);

})();
