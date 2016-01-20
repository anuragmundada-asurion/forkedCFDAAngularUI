"use strict";

!function() {
    angular.module('app').provider('env', function() {
        this.$get = function() {
            return {
                "pub.api.programs": "",
                "setApi": function(uri) {
                    this["pub.api.programs"] = uri;
                }
            };
        };
    });
}();