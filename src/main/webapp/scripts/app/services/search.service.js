!function() {
    'use strict';

    angular.module('app').factory('searchPrograms', ['$resource', 'Program', function($resource, Program){
        return $resource('/search', {}, {
            query: {method:'GET', params: { keyword: '@keyword' }, isArray:true}
        });
    }]);
}();