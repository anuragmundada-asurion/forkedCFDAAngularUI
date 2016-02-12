!function() {
    'use strict';

    angular.module('app').filter('searchRelatedPrograms', function() {
        return function(dataArray, searchTerm) {
            if (!dataArray) return;

            return dataArray.filter(function(item) {
                if (!searchTerm) return true;

                searchTerm = searchTerm.toLowerCase();
                return (item['title'] ? item['title'].toLowerCase().indexOf(searchTerm) > -1 : false) || (item['programNumber'] ? item['programNumber'].toLowerCase().indexOf(searchTerm) > -1 : false);
            });
        }
    });
}();