(function () {
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
            $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from) {
                //  Only scroll to the top if state changes
                if (to['name'] !== from['name']) {
                    $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
                }

            });

            /**
             * global function for change status modal
             *
             * @param Object oEntity  Program | Program Request
             * @param String typeEntity Type of entity provided in oEntity
             * @param String action action to perform (Approve|Reject)
             * @returns Void
             */
            $rootScope.showProgramRequestModal = function (oEntity, typeEntity, action, callback) {
                ngDialog.open({
                    template: 'programs/_ProgramRequestModal.tpl.html',
                    className: 'ngdialog-theme-cfda',
                    data: {
                        oEntity: oEntity,
                        typeEntity: typeEntity,
                        action: action,
                        callback: callback
                    }
                });
            };


            /**
             * Global function for Closing change status modal
             */
            $rootScope.closeModal = function () {
                ngDialog.close();
            };


            /**
             * Whenever ngDialog is opened, make tabindex 0 for 'x'
             */
            $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                var $closeButton = $($dialog.find("div.ngdialog-close")[0]);//wrap it in $() to make it into a jquery obj
                $closeButton.attr("tabindex", "0");
                //need to append <pre></pre> so that the div wont be empty and also wont have any extra spaces.
                // this is needed cuz the div originally only contains :puesdo-elements
                $closeButton.append("<pre></pre>");
                $closeButton.on('keydown', function (event) {
                    if (event.keyCode === 13) {
                        $rootScope.closeModal();
                        event.preventDefault();//make sure other a button such as "Save and Submit" on the Edit Program page doesn't pick up this event also
                    }
                });
            });


            /**
             * Default event trigger after state changes from one to another
             */
            $rootScope.$on('$stateChangeStart', function (event, stateConfig) {
                if (stateConfig.name !== 'searchPrograms' && stateConfig.name !== 'advancedSearch') {
                    //empty Search criteria (keyword & advanced search criterias)
                    //when user go to other pages rather then search
                    SearchFactory.setSearchCriteria(null, {});
                }
            });

            $rootScope.Page = Page;

            /**
             * change page title based on state config
             */
            $rootScope.$on('$stateChangeSuccess', function (event, stateConfig) {
                if (stateConfig['title']) {
                    Page.setTitle(stateConfig['title']);
                }
            });
        }
    ]);

    myApp.config(['$httpProvider', function ($httpProvider) {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            //  initialize get if not there
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }

            //  disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            //  extra
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        }
    }]);
})();
