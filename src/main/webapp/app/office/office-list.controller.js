(function(){
    "use strict";

     var myApp = angular.module('app');
     myApp.controller('RegionalOfficeListController', ['$scope', 'appConstants', 'ApiService', 'Dictionary', 'FederalHierarchyService', 'UserService', 'DTOptionsBuilder', 'DTColumnBuilder', '$q',
        function($scope, appConstants, ApiService, Dictionary, FederalHierarchyService, UserService, DTOptionsBuilder, DTColumnBuilder, $q) {
            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers= appConstants.PAGE_ITEM_NUMBERS;
            $scope.dictionary = {};
            $scope.filter = {
                aDivision:[],
                aAgency: []
            };
            $scope.searchKeyword = '';
            $scope.previousState = null;
            var aDictionay = [ 'regional_office_division', 'states' ];

            var userOrgId = UserService.getUserOrgId();
            if (userOrgId) {
                FederalHierarchyService.getFederalHierarchyById(UserService.getUserOrgId(), true, true, function(oData){
                    $scope.dictionary.aAgency = [FederalHierarchyService.dropdownDataStructure(oData, [])];
                });
            }

            Dictionary.toDropdown({ ids: aDictionay.join(',') }).$promise.then(function(data){
                $scope.dictionary.aDivision = data.regional_office_division;
                $scope.dictionary.aStates = data.states;
            });

            //Group by filter for the Agency ui-select list.
            $scope.multiPickerGroupByFn = function(item) {
                return !!item.parent ? item.parent.value : item.value;
            };

            /**
             * Function loading agencies
             * @returns Void
             * @param data
             * @param callback
             * @param settings
             */
            $scope.loadAgencies = function(data, callback, settings) {
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
                if($scope.filter.aAgency.length > 0 || $scope.filter.aDivision.length > 0) {
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
                    function(d) {
                        var results = d.results;
                        var promises = [];
                        var tableData = [];
                        angular.forEach(results, function(r) {
                            var row = {
                                'agency': r['agencyId'],
                                'street': r['address']['street'],
                                'city': r['address']['city'],
                                'state': r['address']['state'],
                                'phone': r['phone']
                            };
                            promises.push(FederalHierarchyService.getFederalHierarchyById(r['agencyId'], true, false, function(data) {
                                row['agency'] = FederalHierarchyService.getFullNameFederalHierarchy(data);
                            }, function() {
                                row['agency'] = 'Organization Not Found';
                            }));
                            tableData.push(row);
                        });
                        $q.all(promises).then(function() {
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
            $scope.$watch('filter', function() {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            }, true);

            $scope.$watch('searchKeyword', function() {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            }, true);

            /**
             * prepare  data structure to send to regionalOffices API as parameters
             * @param Object oData
             * @returns Object
             */
            $scope.prepareDataStructure = function(oData){
                var aArray = ['aDivision', 'aAgency'];
                var oResult = {};

                //loop through each filter
                angular.forEach(aArray, function(element){
                    if(oData.hasOwnProperty(element)){
                        angular.forEach(oData[element], function(row){
                            if(oResult.hasOwnProperty(element)) {
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
                DTColumnBuilder.newColumn('agency').withTitle('Department/Sub-Tier Agency & Office').withOption('defaultContent', ''),
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
