(function(){
    angular.module('app')
        .directive('uxAdvMultiSelect', advMultiSelect);

    advMultiSelect.$inject = ['$parse', '$filter', '$timeout', 'util'];

    var DEFAULT_DISPLAYED_PAGES = 10,
        FILTER_EXP_REGEX = /([\w\-]+):*\s*([\w\-]+|\{[\w\-:\s\{\}]+\})*:*\s*([\w\-]+)*/i;

    /////////////////

    function advMultiSelect($parse, $filter, $timeout, util) {
        return {
            restrict: 'E',
            require: ['ngModel', 'uxAdvMultiSelect'],
            scope: true,
            controller: advMultiSelectController,
            controllerAs: '_ctrl',
            compile: compile
        };

        //////////////

        function compile(element, attr) {
            var html = '',
                selectedTemplate = '' +
                    '<p>Selected</p>' +
                    '<ul class="usa-unstyled-list action-list">' +
                        '<li class="action-list-item" ng-repeat="item in {0} | selectedChoiceFilter:_ctrl.getSelected():\'{1}\'">' +
                            '<div class="item-btn-group">' +
                                '<button type="button" class="button-circle" ng-click="_ctrl.remove(item)"><span class="fa fa-times"></span></button>' +
                            '</div>' +
                            '<div class="item-title-group">' +
                                '<span>{{_ctrl.choiceTitleGetter(item)}}</span>' +
                            '</div>' +
                        '</li>' +
                    '</ul>';

            html += selectedTemplate.format(attr.uxChoices, attr.uxChoiceValue);

            if(attr.uxSearchFilter) {
                var searchTemplate = '' +
                    '<ux-search-container>' +
                    '<label for="search-input-{0}">Search</label>' +
                    '<input id="search-input-{0}" type="search">' +
                    '</ux-search-container>';

                html += searchTemplate.format(util.nextId());
            }

            var choicesTemplate = '' +
                '<div class="listbox-container">' +
                '<ul role="listbox">' +
                '<li role="option" tabindex="0" ng-click="_ctrl.toggle(choice)" trigger-click-on-enter ng-class="{\'selected\': _ctrl.isSelected(choice)}" ng-repeat="choice in {0} | {1} limitTo:_ctrl.itemsPerPage:_ctrl.offset">{{_ctrl.choiceTitleGetter(choice)}}</li>' +
                '</ul>' +
                '</div>' +
                '<p ng-if="_ctrl.itemCount <= 0">Your search did not match any items.</p>' +
                '<nav ng-if="_ctrl.paginationSet.length > 0" class="pagination-panel small-pagination">' +
                '<ul class="pagination ">' +
                '<li ng-repeat="pageNum in _ctrl.paginationSet" ng-class="{ \'active\': _ctrl.currentPage === pageNum}">' +
                    '<a tabindex="0" trigger-click-on-enter ng-click="_ctrl.currentPage = pageNum">{{pageNum}}</a>' +
                '</li>' +
            '</ul>' +
            '</nav>';

            html += choicesTemplate.format(attr.uxChoices, attr.uxSearchFilter ? attr.uxSearchFilter + " | "  : "");
            element.html(html);

            return postLink;
        }

        function postLink(scope, element, attr, ctrls) {
            var model = ctrls[0],
                controller = ctrls[1];

            controller.model = model;

            if(attr.uxChoiceValue)
                controller.choiceValueGetter = $parse(attr.uxChoiceValue);

            if(attr.uxChoiceTitle)
                controller.choiceTitleGetter = $parse(attr.uxChoiceTitle);

            if(attr.uxSearchFilter) {
                var searchElement = element.find("ux-search-container").find('input');

                searchElement.on('keyup', onSearchTextUpdate)
                    .on('search', onSearchTextUpdate);
            }

            attr.$observe('uxItemsPerPage', function(itemsPerPage) {
                controller.itemsPerPage = $parse(itemsPerPage)(scope);
            });

            attr.$observe('uxDisplayedPages', function(displayedPages){
                controller.displayedPages = $parse(displayedPages)(scope);
            });

            scope.$watchCollection(function() { return getChoices();}, updateItemCount);

            scope.$watchCollection(function(){ return model.$modelValue; }, function(newValue, oldValue) {
                model.$modelValue = null;
            });

            /////////////

            function updateItemCount(choices) {
                if(attr.uxSearchFilter) {
                    var searchExpParts = FILTER_EXP_REGEX.exec(attr.uxSearchFilter)
                    choices = $filter(searchExpParts[1])(choices, $parse(searchExpParts[2])(scope), searchExpParts[3])
                }
                controller.itemCount = choices.length;

                $timeout(function() {
                    scope.$apply();
                });
            }

            function onSearchTextUpdate() {
                scope.srchText = searchElement.val();
                controller.currentPage = 1;
                updateItemCount(getChoices());
            }

            function getChoices() {
                return $parse(attr.uxChoices)(scope);
            }
        }
    }

    function advMultiSelectController() {
        var self = this,
            _currentPage = 1;

        Object.defineProperties(self, {
            'offset': {
                enumerable: true,
                get:function() {
                    var offset = 0;
                    if(angular.isDefined(self.itemsPerPage))
                        offset = self.itemsPerPage * (self.currentPage - 1);
                    return offset;
                }
            },
            'currentPage': {
                enumerable: true,
                get: function() {
                    return _currentPage;
                },
                set: function(newVal) {
                    if(newVal < 1)
                        newVal = 1;
                    else if(getTotalPageCount() < newVal)
                        newVal = getTotalPageCount();

                    _currentPage = newVal;
                }
            },
            'paginationSet': {
                enumerable: true,
                get: getPaginationSet
            }
        });

        angular.extend(self, {
            add: add,
            remove: remove,
            toggle: toggle,
            isSelected: isSelected,
            getSelected: getSelected,
            choiceValueGetter: angular.noop,
            choiceTitleGetter: angular.noop
        });

        ///////////////

        function add(item) {
            item = self.choiceValueGetter(item) || item;

            getSelected().push(item);
        }

        function remove(item) {
            item = self.choiceValueGetter(item) || item;
            var index = getSelected().indexOf(item);

            if(index >= 0)
                getSelected().splice(index, 1);
        }

        function toggle(item) {
            if(isSelected(item))
                remove(item);
            else
                add(item);
        }

        function isSelected(item) {
            item = self.choiceValueGetter(item) || item;
            return getSelected().indexOf(item) >= 0;
        }

        function getTotalPageCount() {
            return Math.ceil(self.itemCount / self.itemsPerPage);
        }

        function getSelected() {
            return self.model.$viewValue;
        }

        function getPaginationSet() {
            var paginationSet = [],
                totalPageCount = getTotalPageCount(),
                displayedPages = self.displayedPages || DEFAULT_DISPLAYED_PAGES,
                midPoint = Math.floor(displayedPages / 2),
                start = self.currentPage - midPoint;
            if(start <= 0) {
                start = 1;
            }

            var end = start + displayedPages - 1;

            if(end > totalPageCount) {
                end = totalPageCount;
                start = totalPageCount - displayedPages + 1;
                if(start <= 0) {
                    start = 1;
                }
            }

            for(var i = start; i <= end && self.itemCount > self.itemsPerPage; i++) {
                paginationSet.push(i);
            }

            return paginationSet;
        }
    }
})();