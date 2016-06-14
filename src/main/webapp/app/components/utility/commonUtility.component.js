var CommonUtility = CommonUtility || {};

CommonUtility.AccordionCFDA = function ($el) {
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

CommonUtility.AccordionCFDA.prototype.$ = function(selector) {
    return this.$root.find(selector);
}

CommonUtility.AccordionCFDA.prototype.hide = function($button) {
    var selector = $button.attr('aria-controls'),
    $content = this.$('#' + selector);

    $button.attr('aria-expanded', false);
    $content.attr('aria-hidden', true);
};

CommonUtility.AccordionCFDA.prototype.show = function($button) {
    var selector = $button.attr('aria-controls'),
    $content = this.$('#' + selector);

    $button.attr('aria-expanded', true);
    $content.attr('aria-hidden', false);
};

CommonUtility.AccordionCFDA.prototype.hideAll = function() {
    var self = this;
    this.$('ul > li > button').each(function() {
      self.hide($(this));
    });
};
