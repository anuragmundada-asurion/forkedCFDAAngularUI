!function() {
  'use strict';

  angular.module('app').directive('searchBox', function() {
    return {
      restrict: 'E',
      templateUrl: 'search/search-box.tpl.html',
      link: function(scope, element, attr, controllers){

        $('.usa-cfda-accordion').each(function() {
          new CommonUtility.AccordionCFDA($(this));
        });
      }
    };
  });
}();
