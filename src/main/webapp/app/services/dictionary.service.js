(function () {
    "use strict";

    var myApp = angular.module('app');

    myApp.factory('Dictionary', ['$resource', '$filter', 'appConstants', function ($resource, $filter, appConstants) {
        return $resource('/api/dictionaries', {}, {
            query: {
                transformResponse: function(data) {
                    data = JSON.parse(data);
                    var dictionary = {};
                    angular.forEach(data, function(dictionaryJSON){
                        updateTreeNodes(dictionaryJSON.id, dictionaryJSON.elements);
                        dictionary[dictionaryJSON.id] = dictionaryJSON.elements;
                    });
                    return dictionary;
                }
            },
            toDropdown: {
                method: 'GET',
                transformResponse: function (data) {
                    data = JSON.parse(data);
                    var dictionary = {};

                    if (data.length === 1) {
                        dictionary = formatDictionary(data[0]);
                    } else if (data.length > 1) {
                        angular.forEach(data, function (dictionaryJSON) {
                            dictionary[dictionaryJSON.id] = formatDictionary(dictionaryJSON)
                        });
                    }
                    return dictionary;
                }
            }
        });

        function isSpecialDictionary(dictionaryName) {
            return !!$filter('filter')(appConstants.CORE_DICTIONARIES, dictionaryName, true).length;
        }

        function updateTreeNodes(dictionaryName, elements, parent) {
            angular.forEach(elements, function(item){
                if(item.elements) {
                    updateTreeNodes(dictionaryName, item.elements, item);
                }

                item.parent = parent;
                item.displayValue = formatDisplayValue(dictionaryName, item);
            });
        }

        //  TODO: Review implementation
        function formatDisplayValue(dictionaryName, item) {
            switch(dictionaryName) {
                case "functional_codes":
                    return (item.parent ? item.parent.value : "") + " - " + item.value;
                default:
                    return item.code + " - " + item.value;
                    break;
            }
        }

        //  TODO Review implementation
        function formatDictionary(data) {
            var isUnique = isSpecialDictionary(data.id),
                codes = isUnique ? {} : [];
            angular.forEach(data.elements, function (parentElem) {
                if (!isUnique) {
                    pushLastItem(parentElem, codes);
                } else {
                    codes[parentElem['element_id']] = parentElem;
                }
            });
            return codes;
        }

        function pushLastItem(item, itemArray) {
            if (!angular.isArray(item.elements)) {
                item.displayValue = item.code + " - " + item.value;
                itemArray.push(item);
            }
            angular.forEach(item.elements, function (element) {
                pushLastItem(element, itemArray);
                element.parent = item;
            });
            item.elements = undefined;
            return item;
        }
    }]);

    //Service
    myApp.service('DictionaryService', [function(){
        //FIXME: remove multi-entry BS
        this.aDictionary = [];

        /**
         *
         * @param Array aData
         * @returns void
         */
        this.setDictionary = function(aData) {
            this.aDictionary = aData;
        };

        /**
         * get stored dictionaries
         * @returns {Array}
         */
        this.getDictionary = function() {
            return this.aDictionary;
        };

        /**
         *
         * @param {Array} aSelectedIDs
         * @param {Boolean} isGrouped
         * @returns {Array}
         */
        this.setSelectedDictionaryIDs = function(aSelectedIDs, isGrouped) {
            return this.aDictionary.map(function(obj){
                if(obj && obj.hasOwnProperty('ticked') && $.inArray(obj.element_id, aSelectedIDs) === -1) {
                    delete obj.ticked;
                } else if($.inArray(obj.element_id, aSelectedIDs) !== -1){
                    obj.ticked = true;
                }

                return obj;
            });
        };
        // END FIXME


        /**
        * jstree data structure
        * https://github.com/ezraroi/ngJsTree
        *
        * @param Array aData Source Data (Dictionary table)
        * @param Array aSelectedData selected data
        * @returns Array
        */
        this.jstreeDataStructure = function(aData, aSelectedData){

          var self = this;
          var results = [];
          var selectedIDs = [];

          //get all selected item ids
          if( aSelectedData && aSelectedData.length > 0){
            angular.forEach(aSelectedData, function (item) {
               if(item && item.hasOwnProperty('element_id')) {
                   selectedIDs.push(item.element_id);
                } else {
                   selectedIDs.push(item);
               }
            });
          }

          angular.forEach(aData, function(oRow){

            // Build jstree item object
            var tmpObj = {}
            // tmpObj.element_id = oRow.element_id;
            // tmpObj.code = oRow.code;
            // tmpObj.value = oRow.value;

            tmpObj.element_id = oRow.hasOwnProperty('data') ?  oRow.data._id : oRow.element_id;
            tmpObj.code = oRow.hasOwnProperty('data') ?  oRow.data.programNumber : oRow.code;
            tmpObj.value = oRow.hasOwnProperty('data') ?  oRow.data.title : oRow.value;

            if(oRow.parent || oRow.hasOwnProperty('data') ){
              tmpObj.text = "<strong>" + tmpObj.code + " - </strong>" + tmpObj.value;
            }else{

              tmpObj.value = tmpObj.value.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              });

              tmpObj.text = "<span style='position: absolute; left: 0;'><strong>"+ tmpObj.code +"</strong></span>" + "<strong>" + tmpObj.value + "</strong>";
              tmpObj.li_attr = { "style": "position: relative;" };
              tmpObj.state = { opened: true };
            }

            // Check if selected
            if ($.inArray(tmpObj.element_id, selectedIDs) !== -1) {
              // Remove item from array
              selectedIDs.splice( selectedIDs.indexOf(tmpObj.element_id), 1);
              // add selected state to item
              tmpObj.state = { selected: true };
            }

            // If it has children do recursion
            if(oRow.elements){
              tmpObj.children = self.jstreeDataStructure(oRow.elements, selectedIDs);
            }

            results.push(tmpObj);
          });

          return results;
        }

        /**
        * isteven plugin multi-select data structure
        * https://github.com/isteven/angular-multi-select.git
        *
        * @param Array aData Source Data (Dictionary table)
        * @param Array aSelectedData selected data
        * @param Boolean isGrouped create nested categories
        * @returns Array
        */
       this.istevenDropdownDataStructure = function(aData, aSelectedData, isGrouped) {
            var results = [];
            var selectedIDs = [];

            //get all selected item ids
            angular.forEach(aSelectedData, function (item) {
               if(item && item.hasOwnProperty('element_id')) {
                   selectedIDs.push(item.element_id);
                } else {
                   selectedIDs.push(item);
               }
            });

            if (isGrouped === true) { //generate nested dropdown list elements
                angular.forEach(aData, function (oRow) {
                    var aElement = oRow.elements;

                    //make sure this item has children before creating nested categories
                    if (typeof aElement === 'object' && aElement !== null && aElement.length > 0) {
                        delete oRow.elements; //remove attribute that has array of element otherwise will trigger an error

                        oRow.msGroup = true;
                        results.push(oRow);

                        angular.forEach(aElement, function (oSubRow) {
                            //pre-select item in dropdown
                            if ($.inArray(oSubRow.element_id, selectedIDs) !== -1) {
                                oSubRow.ticked = true;
                            }

                            results.push(oSubRow);
                        });

                        results.push({msGroup: false});
                    } else {
                        //pre-select item in dropdown
                        if ($.inArray(oRow.element_id, selectedIDs) !== -1) {
                            oRow.ticked = true;
                        }

                        results.push(oRow);
                    }
                });
            } else { //generate single dropdown list elements
                if (aSelectedData !== null) {
                    //selected data
                    angular.forEach(aData, function (oRow) {
                        //pre-select item in dropdown
                        if ($.inArray(oRow.element_id, selectedIDs) !== -1) {
                            oRow.ticked = true;
                        }

                        results.push(oRow);
                    });
                } else { //return data
                    return aData;
                }
            }

            return results;
        };

       /**
        * Reset isteven data structure form inputs
        * @param {aData} data source
        * @param {aAttributes} array of attributes to loop through the aData parameter
        * @returns Array
        */
        this.istevenDropdownResetData = function (aData, aAttributes) {
            angular.forEach(aAttributes, function (attribute) {
                angular.forEach(aData[attribute], function (row, key) {
                    if (aData[attribute][key].hasOwnProperty('ticked')) {
                        delete aData[attribute][key].ticked;
                    }
                });
            });

            return aData;
        };

        /**
        * get IDs from selected data (isteven dropdown structure)
        * @param {aData} data source
        * @param {aAttributes} array of attributes to loop through the aData parameter
        * @returns Object
        */
        this.istevenDropdownGetIds = function (aData, aAttributes) {
            var oResult = {};

            //loop through each filter
            angular.forEach(aAttributes, function (attribute) {
                if (aData.hasOwnProperty(attribute)) {
                    angular.forEach(aData[attribute], function (row) {
                        if (oResult.hasOwnProperty(attribute)) {
                            oResult[attribute].push((row.hasOwnProperty('element_id')) ? row.element_id : row);
                        } else {
                            oResult[attribute] = [(row.hasOwnProperty('element_id')) ? row.element_id : row];
                        }
                    });
                }
            });

            return oResult;
        };
    }]);
})();
