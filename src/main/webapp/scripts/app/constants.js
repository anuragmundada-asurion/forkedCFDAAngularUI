(function(){
    'use strict';

    var appConstants = {
        AUTH_TYPE_KEYS: {
            "act": "act",
            "eo": "executiveOrder",
            "publiclaw": "publicLaw",
            "statute": "statute",
            "usc": "USC"
        },
        PAGE_ITEM_NUMBERS: [
            5,
            10,
            25,
            50,
            100
        ],
        CORE_DICTIONARIES: [
            'yes_no',
            'yes_na',
            'yes_no_na',
            'authorization_type'
        ]
    };

    appConstants.DEFAULT_PAGE_ITEM_NUMBER = appConstants.PAGE_ITEM_NUMBERS[1];

    angular.module('app')
        .constant('appConstants', appConstants);
})();