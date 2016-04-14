(function () {
    "use strict";

    var myApp = angular.module('app');

    myApp.service('FederalHierarchyService', ['ApiService', function (ApiService) {

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
                oParams: {},
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
                //console.log('recieved fh data: ', fhData);
                var levels = {};
                while (fhData.name) {
                    //levels[fhData.type] = fhData.name;
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
                //console.log('returning levels: ', levels);
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
                oParams: {},
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

        return {
            getFullLabelPathFederalHierarchyById: getFullLabelPathFederalHierarchyById,
            getFederalHierarchyById: getFederalHierarchyById,
            dropdownDataStructure: dropdownDataStructure,
            getParentPath: getParentPath,
            getFullNameFederalHierarchy: getFullNameFederalHierarchy,
            getChildren: getChildren
        };
    }]);
})();
