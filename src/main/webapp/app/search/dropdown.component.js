!function() {
    'use strict';
    
    // Decorating isteven multi select directive
    angular.module('app').config([ '$provide', function($provide){
        $provide.decorator('istevenMultiSelectDirective', function($delegate){
            var directive = $delegate[0];
            directive.templateUrl = function(element, attrs){
                return attrs.templateUrl || 'isteven-multi-select.htm';
            };
            return $delegate;
        });
    }]);
    
}();