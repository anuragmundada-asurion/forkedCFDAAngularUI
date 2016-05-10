(function () {
    "use strict";

    var myApp = angular.module('app');

    myApp.service('FederalHierarchyService', ['ApiService', 'UserService', 'AuthorizationService', 'ROLES', function (ApiService, UserService, AuthorizationService, ROLES) {

        /**
         * @returns Void
         * @param id
         * @param includeParentLevels
         * @param includeChildrenLevels
         * @param callbackFnSuccess
         * @param callbackFnError
         */
        var getFederalHierarchyById = function (id, includeParentLevels, includeChildrenLevels, callbackFnSuccess, callbackFnError) {
            var oApiParam = {
                apiName: 'federalHierarchyList',
                apiSuffix: id ? ('/' + id) : '',
                oParams: {
                    'sort': 'name'
                },
                oData: {},
                method: 'GET'
            };

            if (includeParentLevels) {
                oApiParam.oParams['parentLevels'] = 'all';
            }

            if (includeChildrenLevels) {
                oApiParam.oParams['childrenLevels'] = 'all';
            }

            //make api call to get federalHierarchy by id
            return ApiService.call(oApiParam).then(
                function (data) {
                    if (typeof callbackFnSuccess === 'function') {
                        callbackFnSuccess(data);
                    }
                },
                function (error) {
                    if (typeof callbackFnError === 'function') {
                        callbackFnError(error);
                    }
                    return false;
                }
            );
        };

        /**
         *
         * @returns Void
         * @param id
         * @param includeParentLevels
         * @param includeChildrenLevels
         * @param callbackFnSuccess
         * @param callbackFnError
         */
        var getFullLabelPathFederalHierarchyById = function (id, includeParentLevels, includeChildrenLevels, callbackFnSuccess, callbackFnError) {
            getFederalHierarchyById(id, includeParentLevels, includeChildrenLevels, function (oData) {
                if (typeof callbackFnSuccess === 'function') {
                    callbackFnSuccess(getFullNameFederalHierarchy(oData));
                }
            }, function (error) {
                if (typeof callbackFnError === 'function') {
                    callbackFnError(error);
                }
            });
        };

        var getParentPath = function (id, success) {
            var count = 0;
            this.getFederalHierarchyById(id, true, false, function (fhData) {
                var levels = {};
                while (fhData.name) {
                    //first level
                    if (count == 0) {
                        levels['DEPARTMENT'] = fhData.name;
                    }
                    //second level
                    if (count == 1) {
                        levels['AGENCY'] = fhData.name;
                    }
                    //last one
                    if (fhData.hierarchy) {
                        fhData = fhData.hierarchy[0];
                        count++;
                    }
                    //last one
                    else {
                        //have at least more than 2 levels.
                        if (count > 1)
                            levels['OFFICE'] = fhData.name;
                        break;
                    }
                }
                success(levels);
            }, function (error) {
                console.log("Error occured: ", error);
            });
        };


        /**
         * Get a certain level depth of children
         * @param id
         * @param level
         * @returns Object
         */
        var getChildren = function (id, level, callbackFnSuccess, callbackFnError) {

            var oApiParam = {
                apiName: 'federalHierarchyList',
                apiSuffix: id ? ('/' + id) : '',
                oParams: {
                    'sort': 'name'
                },
                oData: {},
                method: 'GET'
            };


            if (level) {
                oApiParam.oParams['childrenLevels'] = level;
            }

            //make api call to get federalHierarchy by id
            ApiService.call(oApiParam).then(
                function (data) {
                    if (typeof callbackFnSuccess === 'function') {
                        callbackFnSuccess(data);
                    }
                },
                function (error) {
                    if (typeof callbackFnError === 'function') {
                        callbackFnError(error);
                    }
                    return false;
                }
            );

        };


        /**
         * for angular-multi-select (Angular Plugin)
         * @param oData
         * @param aSelectedData
         * @returns Object
         */
        var dropdownDataStructure = function (oData, aSelectedData) {
            var oResults = {}, aSelectedIDs = [];

            var oRow = oData;

            //add attribute
            oRow.selected = false;

            //delete unsued attribute
            delete oRow._links;
            delete oRow.parentElementId;

            //get all selected item ids
            angular.forEach(aSelectedData, function (item) {
                aSelectedIDs.push(item.elementId);
            });

            if (oData.hasOwnProperty("hierarchy")) {
                angular.forEach(oData.hierarchy, function (oItem) {
                    angular.extend(oResults, dropdownDataStructure(oItem, aSelectedData));
                });

                if ($.inArray(oRow.elementId, aSelectedIDs) !== -1) {
                    oRow.selected = true;
                }
                angular.extend(oResults, oRow);
            } else {
                if ($.inArray(oRow.elementId, aSelectedIDs) !== -1) {
                    oRow.selected = true;
                }
                angular.extend(oResults, oRow);
            }

            return oResults;
        };

        /**
         * @param oData
         * @returns String
         */
        var getFullNameFederalHierarchy = function (oData) {
            var name = oData.name;

            if (oData.hasOwnProperty('hierarchy')) {
                name += ' / ' + getFullNameFederalHierarchy(oData['hierarchy'][0]);
            }

            return name;
        };

        /**
         * @param id
         * @returns array of rows for datatable
         */
        var dtFormattedData = function (successCallback) {
            var totalRecords = []; //for search
            var dtTopLevelData = []; //for default data in dt
            var childrenMap = {}; //for expanding down to the children

            var level = 0; // to see depth of hierarchy

            var userOrgId = UserService.getUserOrgId();
            //no filter if rmo or super user
            if (AuthorizationService.authorizeByRole([ROLES.SUPER_USER, ROLES.RMO_SUPER_USER])) {
                userOrgId = null;
            }

            //call fh
            getFederalHierarchyById(userOrgId, false, true, function (d) {
                var data;
                if (d._embedded) {
                    data = d._embedded.hierarchy;//if id = null, data returned in embedded property, an array already
                } else {
                    data = [d];//need it as an array
                }

                //last param is to check if currently processing children
                formatData(data, userOrgId);

                var results = {
                    totalData: totalRecords,
                    topLevelData: dtTopLevelData,
                    childrenMappingData: childrenMap
                };
                successCallback(results);
            });

            //helper function; expects data as an array
            var formatData = function (data, id) {
                if (data) {
                    angular.forEach(data, function (currentObj, index, array) {
                        //build one row for datatable
                        var row = {
                            DT_RowId: currentObj.elementId,
                            hierarchyLevel: level,
                            organization: {
                                organizationId: currentObj.elementId,
                                name: currentObj.name,
                                hasParent: (currentObj._links.parent) ? true : false
                            },
                            action: {
                                organizationId: currentObj.elementId,
                                hasChildren: (currentObj.hierarchy) ? true : false //to determine if row is expandable or not
                            }
                        };

                        //determine where to put this row
                        if (row.organization.hasParent) {
                            //current item's id
                            row.organization.parentId = id;
                            row.DT_RowId = "child-" + row.DT_RowId; //append search to search row ids
                            if (!childrenMap[id]) {
                                childrenMap[id] = []; //initlize array if neccessary
                            }
                            childrenMap[id].push(row);//put the parent with id, 's children into array
                        } else {
                            dtTopLevelData.push(row);//put top level departments into dtTopLevelData array
                        }

                        // search will happen on total records, search results are shown as toplevel rows, so need to reset their level
                        var searchRow = angular.copy(row);
                        searchRow.DT_RowId = "search-" + row.DT_RowId; //append search to search row ids
                        searchRow.hierarchyLevel = 0;
                        totalRecords.push(searchRow);

                        //recursion
                        var childrenData = (currentObj.hierarchy) ? currentObj.hierarchy : null;
                        level++;
                        formatData(childrenData, currentObj.elementId);
                    });
                }
                level--;//undo the addition as you leave this function
            };


        };


        return {
            getFullLabelPathFederalHierarchyById: getFullLabelPathFederalHierarchyById,
            getFederalHierarchyById: getFederalHierarchyById,
            dropdownDataStructure: dropdownDataStructure,
            getParentPath: getParentPath,
            getFullNameFederalHierarchy: getFullNameFederalHierarchy,
            getChildren: getChildren,
            dtFormattedData: dtFormattedData
        };
    }]);
})();
