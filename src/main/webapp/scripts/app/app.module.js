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
        'vs-repeat'
    ];

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

    angular.injector(['app.bootstrap'])
        .get('bootstrap')
        .run();
})();