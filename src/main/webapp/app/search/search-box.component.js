!function() {
  'use strict';

  angular.module('app').directive('searchBox', function() {
    return {
      restrict: 'E',
      templateUrl: 'search/search-box.tpl.html',
      link: function(scope, element, attr, controllers){

        function AccordionCFDA($el) {
          var self = this;
          this.$root = $el;
          this.$root.on('click', 'ul > li > button', function(ev) {
            var expanded = JSON.parse($(this).attr('aria-expanded'));
            ev.preventDefault();
            self.hideAll();
            if (!expanded) {
              self.show($(this));
            }
          });
        }

        AccordionCFDA.prototype.$ = function(selector) {
          return this.$root.find(selector);
        }

        AccordionCFDA.prototype.hide = function($button) {
          var selector = $button.attr('aria-controls'),
          $content = this.$('#' + selector);
          
          $button.attr('aria-expanded', false);
          $content.attr('aria-hidden', true);
        };

        AccordionCFDA.prototype.show = function($button) {
          var selector = $button.attr('aria-controls'),
          $content = this.$('#' + selector);

          $button.attr('aria-expanded', true);
          $content.attr('aria-hidden', false);
        };

        AccordionCFDA.prototype.hideAll = function() {
          var self = this;
          this.$('ul > li > button').each(function() {
            self.hide($(this));
          });
        };

        $('.usa-cfda-accordion').each(function() {
          new AccordionCFDA($(this));
        });

      }
    };
  });
}();
