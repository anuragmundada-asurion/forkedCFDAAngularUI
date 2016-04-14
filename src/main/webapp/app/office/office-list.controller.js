(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('RegionalOfficeListController', ['$scope', '$log', 'appConstants', 'ApiService', 'Dictionary', 'FederalHierarchyService', 'UserService',
        function ($scope, $log, appConstants, ApiService, Dictionary, FederalHierarchyService, UserService) {
            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers = appConstants.PAGE_ITEM_NUMBERS;
            $scope.dictionary = {};
            $scope.filter = {
                aDivision: [],
                aAgency: []
            };
            $scope.previousState = null;
            var aDictionay = ['regional_office_division', 'states'];

            var userOrgId = UserService.getUserOrgId();
            if (userOrgId) {
                FederalHierarchyService.getFederalHierarchyById(UserService.getUserOrgId(), true, true, function (oData) {
                    $scope.dictionary.aAgency = [FederalHierarchyService.dropdownDataStructure(oData, [])];

                });

                //
                //FederalHierarchyService.getChildren(UserService.getUserOrgId(), 1, function (oData) {
                //    console.log("got these children: after api call: ", oData);
                //
                //    $scope.dictionary.aAgency2 = [FederalHierarchyService.dropdownDataStructure(oData, [])];
                //    console.log("agency2: " , $scope.dictionary.aAgency2);
                //
                //    //ng-jsTree
                //    $scope.treeConfig2 = {
                //        core: {
                //            multiple: true,
                //            themes: {
                //                dots: true // no connecting dots between dots
                //            }
                //        },
                //        plugins: ["checkbox"]
                //
                //    };
                //    $scope.treeData2 = angular.copy($scope.dictionary.aAgency2);
                //    console.log('passing in : ', $scope.treeData2);
                //    $scope.treeData2 = formatAgencyData($scope.treeData2);
                //    console.log('got back : ', $scope.treeData2);
                //});

                FederalHierarchyService.getChildren(UserService.getUserOrgId(), 1, function (oData) {
                    console.log("fh data: ", oData);

                    $scope.dictionary.aAgency2 = [FederalHierarchyService.dropdownDataStructure(oData, [])];
                    console.log("agency2: ", $scope.dictionary.aAgency2);

                    //ng-jsTree
                    $scope.treeConfig2 = {
                        core: {
                            multiple: true,
                            check_callback : true,
                            themes: {
                                dots: true // no connecting dots between dots
                            }
                        },
                        checkbox: {
                            keep_selected_style: false
                            //tie_selection: false
                        },
                        plugins: ["checkbox"]

                    };

                    $scope.applyModelChanges = function () {
                        return true;
                    };

                    $scope.treeData2 = angular.copy($scope.dictionary.aAgency2);
                    console.log('passing in : ', $scope.treeData2);
                    $scope.treeData2 = formatAgencyData($scope.treeData2);
                    console.log('got back : ', $scope.treeData2);
                    //$scope.treeData2[0].text = 'hi1!!';



                    //callbacks --
                    $scope.treeEventsObj = {
                        'changed': changedNodeCB
                    };

                    function changedNodeCB(e, data) {
                        console.log("--------------");
                        console.log("event fired e: ", e);
                        console.log("event fired data: ", data);
                        console.log("treeData2: ", $scope.treeData2);

                        $log.info('check_node called');
                        var node = data.node;
                        console.log('node checked: ', node);
                        $log.info('node checked: ', node);


                        //only make ajax call if data currently does not have children, dont make calls for stuff thats already loaded
                        if (!node.children || node.children.length == 0) {
                            //make ajax call
                            var elementId = node.original.elementId;
                            console.log('about to call fh with this id:', elementId);
                            FederalHierarchyService.getChildren(elementId, 1, function (oData) {
                                console.log('node clicked, data received', oData);

                                //format it..

                                var children = formatAgencyData(oData.hierarchy);
                                updateChildren($scope.treeData2, children, elementId);
                                console.log('new children: ', children, ' under node: ', node);
                                $scope.treeData2[0].text = 'hello world!!!';

                                console.log("treeData2 after data recieved: ", $scope.treeData2);



                                var selected_nodes = $scope.treeInstance.jstree(true).get_selected();
                                console.log('selected nodes: ', selected_nodes);
                            });
                        }


                        console.log("--------------");
                    }

                });
            }

            function updateChildren(data, children, elementId) {
                console.log('hello from updateChildren');
                //debugger;
                //var foundObjects = _.filter(data, ['elementId', elementId]);
                //
                //var foundObjects = _.filter(data, ['elementId', elementId]);
                //
                //if (foundObjects.length > 0){
                //    foundObjects[0].children = children;
                //    consol.log('dddata-->>', data);
                //}
                //console.log('foundObjects ------>>>', foundObjects);
            }

            function formatAgencyData(dataArray) {
                var keyMapping = {"hierarchy": "children", "name": "text", "sourceOrgId": "id"};

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
             * @param {type} tableState
             * @returns Void
             */
            $scope.loadAgencies = function (tableState) {
                tableState = tableState || {
                        search: {},
                        pagination: {},
                        sort: {}
                    };

                $scope.isLoading = true;

                var oApiParam = {
                    apiName: 'regionalOfficeList',
                    apiSuffix: '',
                    oParams: {
                        limit: $scope.itemsByPage,
                        offset: tableState.pagination.start || 0,
                        includeCount: true
                    },
                    oData: {},
                    method: 'GET'
                };

                if (tableState.search.predicateObject) {
                    oApiParam.oParams['keyword'] = tableState.search.predicateObject.keyword;
                    oApiParam.oParams.offset = 0;
                    tableState.pagination.start = 0;
                }

                //apply agency custom search
                if ($scope.filter.aAgency.length > 0 || $scope.filter.aDivision.length > 0) {
                    oApiParam.oParams['oFilterParam'] = $scope.prepareDataStructure($scope.filter);
                    oApiParam.oParams.offset = 0;
                    tableState.pagination.start = 0;
                }

                if (tableState.sort.predicate) {
                    var isDescending = tableState.sort.reverse,
                        sortingProperty = tableState.sort.predicate;
                    oApiParam.oParams['sortBy'] = ( isDescending ? '-' : '' ) + sortingProperty;
                }

                //call api and get results
                $scope.promise = ApiService.call(oApiParam).then(
                    function (data) {
                        $scope.aAgency = data.results;
                        $scope.isLoading = false;

                        tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                        tableState.pagination.totalItemCount = data.totalCount;
                        $scope.previousState = tableState;
                    },
                    function (error) {

                    });
            };

            //Automatically loadAgencies if Filter scope has changed
            $scope.$watch('filter', function () {
                $scope.loadAgencies($scope.previousState);
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


        }]);
})();
