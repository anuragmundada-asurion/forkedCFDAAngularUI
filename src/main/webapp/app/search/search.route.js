!function() {
    'use strict';

    angular.module('app').config(function($stateProvider) {
        $stateProvider.state('searchPrograms', {
            url: "/search?keyword",
            templateUrl: "search/results.tpl.html",
            controller: "ProgramSearchCtrl"
        });
    });
}();