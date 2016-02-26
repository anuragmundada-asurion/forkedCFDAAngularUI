(function(){
    "use strict";

    angular.module('app').run(['$rootScope', '$document', 'ngDialog',
        function ($rootScope, $document, ngDialog) {
            $rootScope.$on('$stateChangeSuccess', function() {
                $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
            });

            /**
             * global function for change status modal
             * 
             * @param Object oEntity  Program | Program Request
             * @param String typeEntity Type of entity provided in oEntity
             * @param String action action to perform (Approve|Reject)
             * @returns Void
             */
            $rootScope.showChangeStatusModal = function(oEntity, typeEntity, action) {
                ngDialog.open({ 
                    template: 'programs/_ProgramStatusModal.tpl.html', 
                    className: 'ngdialog-theme-default',
                    data: {
                        oEntity: oEntity, 
                        typeEntity: typeEntity,
                        action: action
                    } 
                });
            };

            //global function for Closing change status modal
            $rootScope.closeChangeStatusModal = function() {
                ngDialog.close();
            };
        }]);
})();