'use strict';

!function() {
    angular.module('app')
        .directive('uxHierarchyDropdown', uxHierarchyDropdown);

    uxHierarchyDropdown.$inject = ['$parse', '$compile', '$filter', 'util'];

    var BRANCH_ATTR_REGEX = /^uxBranch([1-9]\d{0,1}|X)$/,
        BRANCH_ATTR_NUM_INDEX = 1,
        BRANCH_EXP_REGEX = /^\s*(?:([\S]+?)\s+as\s+([\S]+?)\s+for\s+([\S]+?)(?:\s+in\s+([\S]+?))?\s+with children\s+([\S]+?)(?:\s+track\s+by\s+([\S]+?))?\s+)?has label\s+([\S]+?|['"][\s\S]+?['"])\s*$/,
        BRANCH_EXP_VALUE_INDEX = 1,
        BRANCH_EXP_AS_LABEL_INDEX = 2,
        BRANCH_EXP_ITEM_INDEX = 3,
        BRANCH_EXP_COLLECTION_INDEX = 4,
        BRANCH_EXP_CHILDREN_INDEX = 5,
        BRANCH_EXP_TRACKBY_INDEX = 6,
        BRANCH_EXP_DROPDOWN_LABEL_INDEX = 7;

    //////////////////

    function uxHierarchyDropdown($parse, $compile, $filter, util) {
        return {
            restrict: "E",
            require: 'ngModel',
            template: "<div></div>",
            scope: {
                ngModel: "=",
                uxTree: "="
            },
            compile: compile
        };

        function compile(element, attr) {
            var config = {
                common: {
                    isMultiple: angular.isDefined(attr.uxMultiple)
                },
                branches: {}
            };

            angular.forEach(attr, function(attrVal, attrName){
                var matches = BRANCH_ATTR_REGEX.exec(attrName);
                if(matches) {
                    var expMatches = BRANCH_EXP_REGEX.exec(attrVal),
                        branchNumber = matches[BRANCH_ATTR_NUM_INDEX];
                    var branchConfig = config.branches[branchNumber] = {
                        dropdownLabelGetter: $parse(expMatches[BRANCH_EXP_DROPDOWN_LABEL_INDEX])
                    };
                    if(expMatches[BRANCH_EXP_ITEM_INDEX])
                        branchConfig.itemName = expMatches[BRANCH_EXP_ITEM_INDEX];
                    if(expMatches[BRANCH_EXP_AS_LABEL_INDEX]) {
                        branchConfig.itemLabelName = expMatches[BRANCH_EXP_AS_LABEL_INDEX];
                        branchConfig.itemLabelGetter = $parse(branchConfig.itemLabelName.replace(branchConfig.itemName +".", ""))
                    }
                    if(expMatches[BRANCH_EXP_CHILDREN_INDEX]) {
                        branchConfig.childrenName = expMatches[BRANCH_EXP_CHILDREN_INDEX];
                        branchConfig.childrenGetter = $parse(branchConfig.childrenName.replace(branchConfig.itemName +".", ""));
                    }
                    if(expMatches[BRANCH_EXP_TRACKBY_INDEX])
                        branchConfig.trackByName = expMatches[BRANCH_EXP_TRACKBY_INDEX];
                    if(branchNumber === "X")
                        branchConfig.parentCollectionName = expMatches[BRANCH_EXP_COLLECTION_INDEX];

                    if(expMatches[BRANCH_EXP_VALUE_INDEX]) {
                        var propertyName = expMatches[BRANCH_EXP_VALUE_INDEX].replace(branchConfig.itemName +".", "");
                        branchConfig.valueGetter = $parse(propertyName);
                    }
                }
            });

            if(!config.branches.X)
                throw "Err! This directive is missing the 'ux-branch-x' attribute!";
            if(config.branches.X && !config.branches.X.parentCollectionName)
                throw "Err! The 'ux-branch-x' attribute is missing a parent collection variable after the 'in' clause!";

            if(config.common.isMultiple) {
                var selectedTemplate = '' +
                    '<p>Selected</p>' +
                    '<ul class="usa-unstyled-list action-list">' +
                    '<li class="action-list-item" ng-repeat="item in selectedItemsAsNodes track by item.$key">' +
                    '<div class="item-btn-group">' +
                    '<button type="button" class="button-circle" ng-click="removeItem(item.$key)"><span class="fa fa-times"></span></button>' +
                    '</div>' +
                    '<div class="item-title-group">' +
                    '<span>{{ getItemLabel(item) }}</span>' +
                    '</div>' +
                    '</li>' +
                    '</ul>';
                element.find('div').append(selectedTemplate);
            }


            return function postLink(scope, element, attr, model) {
                scope._hierarchyConfig = config;
                scope._branchSelections = [];
                scope.selectedItemsAsNodes = [];

                var elementSelections = [],
                    traverseConfig = {
                        branches: {}
                    };

                angular.forEach(scope._hierarchyConfig.branches, function(branch, key){
                    traverseConfig.branches[key] = {
                        keyProperty: branch.valueGetter || scope._hierarchyConfig.branches.X.valueGetter,
                        childrenProperty: branch.childrenGetter || scope._hierarchyConfig.branches.X.childrenGetter
                    }
                });

                createSelectElement(0, getHierarchyConfig(0));

                if(scope._hierarchyConfig.common.isMultiple) {
                    angular.extend(scope, {
                        getSelectedItems: getSelectedItems,
                        addItem: addItem,
                        removeItem: removeItem,
                        getItemLabel: getItemLabel,
                        isSelected: isSelected
                    });

                    scope.$watchCollection(function(){ return model.$modelValue; }, function(newValue) {
                        model.$modelValue = null;
                        scope.selectedItemsAsNodes = $filter('traverseTree')(newValue, scope.uxTree, traverseConfig);
                    });
                }
                else {
                    scope.$watch(function() { return model.$modelValue; }, function(newValue){
                        if(angular.isArray(newValue)) {
                            model.$setViewValue(newValue[0]);
                        }
                        else {
                            var parentTraverseConfig = angular.extend({
                                includeParent: true
                            }, traverseConfig);
                            var node = $filter('traverseTree')([newValue], scope.uxTree, parentTraverseConfig)[0];
                            if(node && !scope._branchSelections[node.$level - 1])
                                setupOnWatch(node);
                        }
                    });
                }

                scope.$watchCollection('_branchSelections', function(newCol, oldCol) {
                    var foundChange = false;
                    for(var i = 0; i < newCol.length || i < oldCol.length; i++) {
                        if(newCol[i] !== oldCol[i]) {
                            foundChange = true;
                            var childIndex = i + 1,
                                childConfig = getHierarchyConfig(childIndex);
                            if(!elementSelections[childIndex])
                                createSelectElement(childIndex, childConfig);
                            var value = !$parse(childConfig.parentCollectionName +".length")(scope)
                                ? getHierarchyConfig(i).valueGetter(scope._branchSelections[i])
                                : null;
                            if(!scope._hierarchyConfig.common.isMultiple)
                                model.$setViewValue(value);
                            else
                                scope._hierarchyConfig.common.selected = value;
                        }
                        else if(foundChange) {
                            newCol.splice(i);
                        }
                    }
                });

                /////////////////

                function getHierarchyConfig(index) {
                    var hConfig = scope._hierarchyConfig.branches,
                        config = hConfig[index + 1];
                    if(!config || !config._isSet) {
                        config = hConfig[index + 1] =
                            angular.extend(angular.copy(hConfig.X), hConfig[index + 1] || {});
                        var itemName = config.itemName;
                        config.ngModelProperty = "_branchSelections[" + index + "]";
                        config.itemCollectionName = config.ngModelProperty + config.childrenName.replace(itemName,"");
                        if(index !== 0)
                            config.parentCollectionName = "_branchSelections[" + (index - 1) + "]"  + config.childrenName.replace(itemName,"");
                    }
                    return config;
                }

                function createSelectElement(branchIndex, config) {
                    var ngIf = branchIndex > 0 ? "ng-if='{0}.length'".format(config.parentCollectionName) : '',
                        addButtonHtml = scope._hierarchyConfig.common.isMultiple
                            ? '<button type="button" ng-if="({0}.length === 0 || !{0}) && {1}" ng-disabled="isSelected({1}, branchIndex)" ng-click="addItem()">add</button>'.format(config.itemCollectionName, config.ngModelProperty)
                            : '',
                        html = "" +
                            "<div class='ux-hd-dropdown-container' {5}>" +
                            "<label for='ux-hierarchy-dropdown-{8}'>{6}</label>" +
                            "<select id='ux-hierarchy-dropdown-{8}' ng-options='{0} as {1} for {0} in {2} track by {3}' ng-model='{4}'>" +
                            "<option value=''></option>" +
                            "</select>{7}" +
                            "</div>";
                    html = html.format(config.itemName, config.itemLabelName, config.parentCollectionName, config.trackByName, config.ngModelProperty, ngIf, config.dropdownLabelGetter(scope), addButtonHtml, util.nextId());
                    var selectElement = angular.element(html);
                    $compile(selectElement)(scope);
                    elementSelections[branchIndex] = selectElement;
                    element.append(selectElement);
                }

                function setupOnWatch(node) {
                    if(node.$parent)
                        setupOnWatch(node.$parent);
                    var index = node.$level - 1;
                    scope._branchSelections[index] = node.$original;
                    if(!elementSelections[index])
                        createSelectElement(index, getHierarchyConfig(index));
                }

                function getItemLabel(treeNode) {
                    var bConfig = scope._hierarchyConfig.branches[treeNode.$level]
                            || scope._hierarchyConfig.branches.X;

                    return bConfig.itemLabelGetter(treeNode.$original)
                }

                function getSelectedItems() {
                    var arr = model.$viewValue;
                    if(!angular.isArray(model.$viewValue))
                        model.$setViewValue((arr = []));
                    return arr;
                }

                function addItem() {
                    var item = scope._hierarchyConfig.common.selected,
                        selectedItems = getSelectedItems();
                    if(item && selectedItems.indexOf(item) === -1)
                        selectedItems.push(item);
                }

                function removeItem(item) {
                    var index = getSelectedItems().indexOf(item);
                    if(index >= 0)
                        getSelectedItems().splice(index, 1);
                }

                function isSelected(item, index) {
                    var bConfig = getHierarchyConfig(index),
                        value = bConfig.valueGetter(item);
                    return getSelectedItems().indexOf(value) >= 0;
                }
            }
        }
    }
}();