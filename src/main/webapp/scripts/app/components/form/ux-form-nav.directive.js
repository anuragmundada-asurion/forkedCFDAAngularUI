(function(){
    angular.module('app')
        .directive('uxFormNav', uxFormNavDirective);

    /////////////////

    function uxFormNavDirective() {
        return {
            restrict: 'AE',
            require: '^^uxForm',
            templateUrl: 'partials/components/form/ux-form-nav.tpl.html'
        };
    }
})();