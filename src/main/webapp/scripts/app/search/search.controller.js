!function() {
    'use strict';

    angular.module('app').controller('ProgramSearchCtrl', ['$rootScope', '$scope', '$stateParams', '$location', 'appConstants', 'Search',
        function($rootScope, $scope, $stateParams, $location, appConstants, Search) {
            $scope['globalSearchValue'] = $rootScope['globalSearchValue'] || $stateParams['keyword'] || '';
            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers = appConstants.PAGE_ITEM_NUMBERS;

            $scope.searchKeyUp = function(keyCode) {
                if (keyCode === 13) {
                    $scope.searchPrograms();
                }
            };

            $scope.searchPrograms = function() {
                if ($scope['globalSearchValue']) {
                    $rootScope['globalSearchValue'] = $scope['globalSearchValue'];
                    $location.path('/search');
                    $location.search('keyword', $scope['globalSearchValue']);
                }
            };

            $scope.getSearchResults = function(tableState) {
                tableState = tableState || {
                    search: {},
                    pagination: {},
                    sort: {}
                };

                $scope.isLoading = true;

                var queryObj = {
                    keyword: $scope.globalSearchValue,
                    size: $scope.itemsByPage,
                    includeCount: true
                };

                if (tableState.pagination.start) {
                    queryObj["page"] = Math.ceil(tableState.pagination.start / queryObj.size);
                }

                if (tableState.sort.predicate) {
                    var isDescending = tableState.sort.reverse,
                        sortingProperty = tableState.sort.predicate;
                    queryObj.sortBy = ( isDescending ? '-' : '' ) + sortingProperty;
                }

                Search.get(queryObj, function(data) {
                    $scope.searchResults = data.results;
                    $scope.isLoading = false;
                    tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                    tableState.pagination.totalItemCount = data.totalCount;
                });
            }
        }
    ]);
}();