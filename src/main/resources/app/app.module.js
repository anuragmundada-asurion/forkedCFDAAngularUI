(function(){
    "use strict"

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
        'ui.select'
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
        }
    }, applyExtensions);

    function applyExtensions(fn, name){
        var jqLite = angular.element;
        jqLite.prototype[name] = function(arg1, arg2) {
            var value;
            for(var i=0; i < this.length; i++) {
                if (value == undefined) {
                    value = fn(this[i], arg1, arg2);
                    if (value !== undefined) {
                        value = jqLite(value);
                    }
                }
            }
            return value == undefined ? this : value;
        }
    }
})();