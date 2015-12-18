(function(){
    'use strict';

    angular.module('app')
        .constant('authTypeConstants',{
            AUTH_TYPE_KEYS: {
                "act": "act",
                "eo": "executiveOrder",
                "publiclaw": "publicLaw",
                "statute": "statute",
                "usc": "USC"
            }
        })
})();