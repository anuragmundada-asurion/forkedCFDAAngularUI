!function() {
    'use strict';

    angular.module('app').factory('SearchFactory', ['$resource', function($resource) {
        var searchCriteriaHolder = {
            'keyword': null,
            'advancedSearch': {}
        };
        
        return {
            setSearchCriteria: function(keyword, advancedSearchData){
                searchCriteriaHolder.keyword = keyword;
                searchCriteriaHolder.advancedSearch = advancedSearchData;
            },
            getSearchCriteria: function() {
                return searchCriteriaHolder;
            },
            search: function() {
                return $resource('/api/search', {}, {
                    get: { method:'GET', params: { keyword: '@keyword' }}
                });
            }
        };
    }]);
}();