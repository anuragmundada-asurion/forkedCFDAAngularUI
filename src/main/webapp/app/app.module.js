(function(){
    "use strict";

    var requiredModules = [
        'ngAnimate',
        'ngResource',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'duScroll',
        'smart-table',
        'mgo-angular-wizard',
        'ui.select',
        'ui.bootstrap',
        'sticky',
        'vs-repeat',
        'ngDialog',
        'angularMoment',
        'isteven-multi-select',
        'angular-multi-select',
        'datatables'
    ];

    /**
     * @ngdoc overview
     * @name app
     *
     * @requires ngAnimate
     * @requires ngResource
     * @requires ngTouch
     * @requires ngSanitize
     * @requires ui.router
     * @requires duScroll
     * @requires smart-table
     * @requires mgo-angular-wizard
     * @requires ui.select
     * @requires ui.bootstrap
     * @requires sticky
     * @requires vs-repeat
     *
     * @description
     * # ui.router
     *
     * ## The main module for ui.router
     * There are several sub-modules included with the ui.router module, however only this module is needed
     * as a dependency within your angular app. The other modules are for organization purposes.
     *
     * The modules are:
     * * ui.router - the main "umbrella" module
     * * ui.router.router -
     *
     * *You'll need to include **only** this module as the dependency within your angular app.*
     *
     * <pre>
     * <!doctype html>
     * <html ng-app="myApp">
     * <head>
     *   <script src="js/angular.js"></script>
     *   <!-- Include the ui-router script -->
     *   <script src="js/angular-ui-router.min.js"></script>
     *   <script>
     *     // ...and add 'ui.router' as a dependency
     *     var myApp = angular.module('myApp', ['ui.router']);
     *   </script>
     * </head>
     * <body>
     * </body>
     * </html>
     * </pre>
     */
    angular.module('app', requiredModules);

    //TODO: Avoid extending the existing object and move these functions into the util service as helper methods instead.

    //Extending jqLite
    angular.forEach({
        findAll: function (element, selector) {
            var queried = element.querySelectorAll(selector);
            if(queried.length === 1)
                queried = queried[0];
            return angular.element(queried);
        },
        focus: function(element) {
            element.focus();
            return element;
        },
        click: function(element) {
            element.click();
            return element;
        },
        select: function(element) {
            element.select();
            return element;
        },
        height: function(element) {
            return element.offsetHeight;
        }
    }, applyExtensions);

    function applyExtensions(fn, name){
        var jqLite = window.angular.element;
        jqLite.prototype[name] = function(arg1, arg2) {
            var value;
            for(var i=0; i < this.length && !value; i++)
                value = fn(this[i], arg1, arg2);

            return value;
        }
    }
    window.String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    window.String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
    
    // Temporary adding this to theme some pages
    angular.module('app').run( function($rootScope, $state) {
        $rootScope.$state = $state;
    } );
    
    
})();