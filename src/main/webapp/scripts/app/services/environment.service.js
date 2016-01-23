"use strict";

!function() {
    angular.module('app')
        .provider('env', envProvider);

    ////////////////

    function envProvider() {
        this.$get = Env;

        ///////////////////

        function Env() {
            var provider =  {
                "pub.api.programs": "",
                setApi: setApi
            };

            return provider;

            /////////////

            function setApi(envName, uri) {
                provider[envName] = uri;
            }
        }
    }
}();