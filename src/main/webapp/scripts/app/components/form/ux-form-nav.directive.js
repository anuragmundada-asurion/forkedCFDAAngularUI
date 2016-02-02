(function(){
    angular.module('app')
        .directive('uxFormNav', uxFormNavDirective);

    /////////////////

    function uxFormNavDirective() {
        return {
            restrict: 'AE',
            require: '^^uxForm',
            templateUrl: 'components/form/ux-form-nav.tpl.html',
            link: postLink
        };

        ////////////////

        function postLink(scope, element, attrs, controller) {
            scope.$watch(getElementHeight, function(heightVal){
                scope.offset = controller.offset = heightVal;
            });

            /////////////

            function getElementHeight() {
                return element.height();
            }
        }
    }
})();