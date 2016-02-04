(function() {
    "use strict";

    angular
        .module('app')
        .filter('traverseTree', traverseTree);

    traverseTree.$inject = ['$parse'];

    ////////////////

    function traverseTree($parse) {

        return filterExp;

        /////////////////

        function filterExp(keys, tree, config) {
            config = angular.copy(config);

            var out = [];
            if (angular.isArray(keys) && angular.isArray(tree) && angular.isObject(config)) {
                keys.forEach(function(key){
                    var item = searchForItem(key, tree, config);
                    if(item)
                        out.push(item);
                });
            }
            return out;
        }

        function searchForItem(key, treeItems, config, level) {
            var foundTreeItem;
            level = level || 1;

            for(var i = 0; i < treeItems.length && !foundTreeItem; i++) {
                var treeItem = treeItems[i],
                    keyProperty = config.branches[level] && config.branches[level].keyProperty
                        ? config.branches[level].keyProperty
                        : config.branches.X.keyProperty,
                    treeItemKey = keyProperty(treeItem);
                if(treeItemKey === key) {
                    foundTreeItem = {
                        $level: level,
                        $key: treeItemKey,
                        $original: treeItem
                    };
                }
                else {
                    var childrenProperty = config.branches[level] && config.branches[level].childrenProperty
                            ? config.branches[level].childrenProperty
                            : config.branches.X.childrenProperty,
                        children = childrenProperty(treeItem);
                    if(children) {
                        foundTreeItem = searchForItem(key, children, config, level + 1);
                        if(foundTreeItem && config.includeParent) {
                            setParent(foundTreeItem, {
                                $key: treeItemKey,
                                $original: treeItem,
                                $level: level
                            });
                        }
                    }
                }
            }

            return foundTreeItem;
        }

        function setParent(item, parent) {
            if(item.$parent)
                setParent(item.$parent, parent);
            else
                item.$parent = parent;
        }
    }
})();