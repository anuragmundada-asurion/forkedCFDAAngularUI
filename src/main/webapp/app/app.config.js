(function(){
    "use strict";

    var myApp = angular.module('app');

    //PATCH: https://github.com/alexandernst/angular-multi-select/issues/84
    var angular_multi_select = angular.module('angular-multi-select');
    angular_multi_select.run(['$templateCache', function ($templateCache) {
            var tpl = $templateCache.get('angular-multi-select.tpl');
            tpl = tpl.replace(/(class="(?:.*?)ams-item-text(?:.*?)")/gi, '$1 ng-click="item[amsc.INTERNAL_KEY_CHILDREN_LEAFS] === 0 && amse.toggle_check_node(item) || amse.toggle_open_node(item)"');
            $templateCache.put('angular-multi-select.tpl', tpl);
    }]);

    myApp.run(['$rootScope', '$document', '$state', 'ngDialog', 'SearchFactory', 'Page',
        function ($rootScope, $document, $state, ngDialog, SearchFactory, Page) {
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
            $rootScope.showProgramRequestModal = function(oEntity, typeEntity, action) {
                ngDialog.open({ 
                    template: 'programs/_ProgramRequestModal.tpl.html', 
                    className: 'ngdialog-theme-default',
                    data: {
                        oEntity: oEntity, 
                        typeEntity: typeEntity,
                        action: action
                    } 
                });
            };

            //global function for Closing change status modal
            $rootScope.closeProgramRequestModal = function() {
                ngDialog.close();
            };

            /**
             * Default event trigger after state changes from one to another
             */
            $rootScope.$on('$stateChangeStart', function(event, stateConfig){
                if(stateConfig.name !== 'searchPrograms' && stateConfig.name !== 'advancedSearch') {
                    //empty Search criteria (keyword & advanced search criterias) 
                    //when user go to other pages rather then search
                    SearchFactory.setSearchCriteria(null, {});
                }

                //bugfix: angular-ui-router: 0.2.13+
                //http://stackoverflow.com/questions/27120308/angular-ui-router-urlrouterprovider-when-not-working-when-i-click-a-ui-sref
                if (stateConfig.name === "programList") { 
                    event.preventDefault();
                    $state.go('programList.status', {status: 'all'});
                }
            });

            $rootScope.Page = Page;

            /**
             * change page title based on state config
             */
            $rootScope.$on('$stateChangeSuccess', function(event, stateConfig) {
                if (stateConfig['title']) {
                    Page.setTitle(stateConfig['title']);
                }
            });
        }
    ]);

    myApp.config(['$httpProvider', function($httpProvider) {
        //  initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        //  disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        //  extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        $httpProvider.interceptors.push(function(UserService) {
            return {
                'request': function(config) {
                    var user = UserService.getUser();
                    if (user) {
                        config['headers']['X-Auth-Token'] = Cookies.get('iPlanetDirectoryPro');
                    }
                    return config;
                }
            };
        });
    }]);
})();
