(function(){
    "use strict";

    angular
        .module('app')
        .controller('HomeController', homeController);

    homeController.$inject = ['$state', 'appConstants', 'Program'];

    //////////////////////

    function homeController($state, appConstants, Program) {
        var vm = this,
            previousState;

        angular.extend(vm, {
            itemsByPage: appConstants.DEFAULT_PAGE_ITEM_NUMBER,
            itemsByPageNumbers: appConstants.PAGE_ITEM_NUMBERS,

            data: {
                singleSelect: null,
                multipleSelect: [],
                option1: 'option-1',
            },
            programList: programList,
            getPdf: getPdf
        });

        /////////////////////

        function programList() {
            $state.go('programList');
        }

        function getPdf() {
            console.log("===== getPdf()");
            console.log("===== " + JSON.stringify(vm.data));
        }
    }

})();