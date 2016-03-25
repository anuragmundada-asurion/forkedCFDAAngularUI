!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('Page', function() {
        var title = 'Home - CFDA: Home';
        return {
            title: function() { return title; },
            setTitle: function(newTitle) { title = newTitle }
        };
    });
}();