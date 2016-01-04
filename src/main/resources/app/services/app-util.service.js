(function() {
    "use strict";

    angular
        .module('app')
        .factory('appUtil', appUtilSvc);

    appUtilSvc.$inject = ['$parse'];
    ////////////////

    function appUtilSvc($parse) {
        var congressCodeGetter = $parse('publicLaw.congressCode'),
            lawNumberGetter = $parse('publicLaw.lawNumber'),
            volumeGetter = $parse('statute.volume'),
            pageGetter = $parse('statute.page'),
            uscTitleGetter = $parse('USC.title'),
            actTitleGetter = $parse('act.title'),
            eoTitleGetter = $parse('executiveOrder.title'),
            undefinedTextValue = "___";

        return {
            getAuthorizationTitle: getAuthorizationTitle
        };

        ////////////////////

        function getAuthorizationTitle(authorization) {
            var type = authorization.authorizationType,
                title;

            switch (type) {
                case "publiclaw":
                    title = "Public Law " + (congressCodeGetter(authorization) || undefinedTextValue) + "-" + (lawNumberGetter(authorization) || undefinedTextValue);
                    break;
                case "statute":
                    title = (volumeGetter(authorization) || undefinedTextValue) + " Stat. " + (pageGetter(authorization) || undefinedTextValue);
                    break;
                case "usc":
                    title = uscTitleGetter(authorization);
                    break;
                case "act":
                    title = actTitleGetter(authorization);
                    break;
                case "eo":
                    title = eoTitleGetter(authorization);
                    break;
            }
            return title;
        }
    }
})();