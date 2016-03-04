(function(){
    "use strict";

    var myApp = angular.module('app');

    myApp.run(['$rootScope', '$document', 'ngDialog',
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
        }
    ]);

    myApp.config(['$httpProvider', function($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);
})();