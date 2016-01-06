(function(){
    "use strict";

    var requiredModules = [
        'app.settings',
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


    //Extending jqLite
    angular.forEach({
        findAll: function hoverFn(element, selector) {
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
            for(var i=0; i < this.length; i++) {
                if (value == undefined) {
                    value = fn(this[i], arg1, arg2);
                    if (value !== undefined && value.prototype === jqLite.prototype) {
                        value = jqLite(value);
                    }
                }
            }
            return value == undefined ? this : value;
        }
    }
    window.String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
})();