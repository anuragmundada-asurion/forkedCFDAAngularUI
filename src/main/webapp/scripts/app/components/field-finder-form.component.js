(function() {
    "use strict";

    angular
        .module('app')
        .directive('fieldFinderForm', fieldFinderForm);

    //////////////////

    function fieldFinderForm() {
        fieldFinderFormController.$inject = ['$scope', '$q', '$timeout'];
        return {
            restrict: 'AE',
            controller: fieldFinderFormController,
            controllerAs: 'fieldFinder',
            bindToController: true,
            scope: false
        };

        ///////////////////////

        function fieldFinderFormController($scope, $q, $timeout) {
            var vm = this,
                waitingPromise,
                unsubscribeWizardStepChanged = $scope.$on('wizard:stepChanged', onStepChange);

            vm.addBookmark = addBookmark;
            vm.go = go;
            vm.bookmarks = [];

            $scope.$on('$destroy', onScopeDestroy);

            //////////////////////////

            function addBookmark(bookmark) {
                vm.bookmarks.push(bookmark);
            }
            function go(bookmark){
                bookmark = bookmark || vm.selected;
                var goToElement = function(){
                    bookmark.goToElement(vm.offset);
                };
                if(bookmark) {
                    var section = vm.selected.section;
                    if(!section || section.isCurrentSection())
                        goToElement();
                    else {
                        section.goToSection();
                        waitingPromise = $q.defer();
                        waitingPromise.promise.then(function() {
                            $timeout(goToElement, 100);
                        });
                    }
                }
            }

            function onStepChange() {
                if(waitingPromise) {
                    waitingPromise.resolve();
                    waitingPromise = null;
                }
            }

            function onScopeDestroy() {
                unsubscribeWizardStepChanged();
            }
        }
    }
})();