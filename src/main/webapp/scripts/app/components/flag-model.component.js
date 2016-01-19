(function() {
    "use strict";
    var directiveName = 'flagModel';

    angular
        .module('app')
        .directive('flagModel', flagModelDirective);

    flagModelDirective.$inject = ['$parse'];

    //////////////////

    function flagModelDirective($parse) {
        return {
            require: '?ngModel',
            restrict: "A",
            scope: {
                value: '=' + directiveName
            },
            link: link
        };

        /////////////////

        function link(scope, element, attrs, ctrl) {
            if (!ctrl) return;

            var value = scope.value,
                dictionaryGetter = $parse(value.dictionary),
                yesValueGetter = $parse(value.yes),
                noValueGetter = $parse(value.no);
        }
    }
})();