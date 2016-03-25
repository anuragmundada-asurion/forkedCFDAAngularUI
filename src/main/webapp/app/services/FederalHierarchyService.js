(function () {
    "use strict";

    var myApp = angular.module('app');

    myApp.service('FederalHierarchyService', ['ApiService', function (ApiService) {

        /**
         * @param String id
         * @param Boolean includeParentLevels
         * @param Boolean includeChildrenLevels
         * @param Function callbackFnSuccess
         * @returns Void
         */
        var getFederalHierarchyById = function (id, includeParentLevels, includeChildrenLevels, callbackFnSuccess) {
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
                    return false;
                }
            );
        };

        /**
         * @param String id
         * @param Boolean includeParentLevels
         * @param Boolean includeChildrenLevels
         * @param function callbackFnSuccess
         * @returns Void
         */
        var getFullLabelPathFederalHierarchyById = function (id, includeParentLevels, includeChildrenLevels, callbackFnSuccess) {
            getFederalHierarchyById(id, includeParentLevels, includeChildrenLevels, function(oData){
                if (typeof callbackFnSuccess === 'function') {
                    callbackFnSuccess(getFullNameFederalHierarchy(oData));
                }
            });
        };

        var getParentPath = function (id, success) {
            this.getFederalHierarchyById(id, true, false, function (fhData) {
                var levels = {};
                while (fhData.name) {
                    levels[fhData.type] = fhData.name;
                    if (fhData.hierarchy) {
                        fhData = fhData.hierarchy[0];
                    }
                    else {
                        break;
                    }
                }
                success(levels);
            }, function (error) {
                console.log("Error occured: ", error);
            });
        };

        /**
         * for angular-multi-select (Angular Plugin)
         * @param Object oData
         * @param Array aSelectedIDs
         * @returns Object
         */
        var dropdownDataStructure = function(oData, aSelectedData) {
            var oResults = {}, aSelectedIDs = [];

            var oRow = oData;

            //add attribute
            oRow.selected = false;

            //delete unsued attribute
            delete oRow._links;
            delete oRow.parentElementId;

            //get all selected item ids
            angular.forEach(aSelectedData, function(item){
                aSelectedIDs.push(item.elementId);
            });

            if(oData.hasOwnProperty("hierarchy")) {
                angular.forEach(oData.hierarchy, function(oItem){
                    angular.extend(oResults, dropdownDataStructure(oItem, aSelectedData));
                });

                if($.inArray(oRow.elementId, aSelectedIDs) !== -1) {
                    oRow.selected = true;
                }
                angular.extend(oResults, oRow);
            } else {
                if($.inArray(oRow.elementId, aSelectedIDs) !== -1) {
                    oRow.selected = true;
                }
                angular.extend(oResults, oRow);
            }

            return oResults;
        };

        /**
         * @param Object oData
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
            getFullNameFederalHierarchy: getFullNameFederalHierarchy
        };
    }]);
})();
