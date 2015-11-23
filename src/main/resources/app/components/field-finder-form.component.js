(function() {
    "use strict"

    angular
        .module('app')
        .directive('fieldFinderForm', fieldFinderForm);

    fieldFinderForm.$inject = [];

    //////////////////

    function fieldFinderForm() {
        return {
            restrict: 'AE',
            controller: fieldFinderFormController,
            controllerAs: 'fieldFinder',
            bindToController: true,
            scope: false
        };

        ///////////////////////

        function fieldFinderFormController() {
            var vm = this;

            vm.addBookmark = addBookmark;
            vm.go = go;
            vm.bookmarks = [];

            //////////////////////////

            function addBookmark(bookmark) {
                vm.bookmarks.push(bookmark);
            }

            function go(){
                if(vm.selected)
                    vm.selected.goToElement();
            }
        }
    }
})();