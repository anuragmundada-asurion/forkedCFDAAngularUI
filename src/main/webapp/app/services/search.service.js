!function() {
    'use strict';

    angular.module('app').factory('Search', ['$resource', function($resource){
        return $resource('/api/search', {}, {
            get: {method:'GET', params: { keyword: '@keyword' }}
        });
    }]);
}();