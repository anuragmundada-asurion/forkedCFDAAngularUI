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
            uscSectionGetter = $parse('USC.section'),
            actTitleGetter = $parse('act.title'),
            actPartGetter = $parse('act.part'),
            actSectionGetter = $parse('act.section'),
            eoTitleGetter = $parse('executiveOrder.title'),
            accountGetter = $parse('code'),
            undefinedTextValue = "";

        return {
            getAuthorizationTitle: getAuthorizationTitle,
            getAccountTitle: getAccountTitle
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
                    title = "Statute " + (volumeGetter(authorization) || undefinedTextValue) + "-" + (pageGetter(authorization) || undefinedTextValue);
                    break;
                case "usc":
                    title = (uscTitleGetter(authorization) || undefinedTextValue) + " US Code " + (uscSectionGetter(authorization) || undefinedTextValue);
                    break;
                case "act":
                    title = (actTitleGetter(authorization) || undefinedTextValue) + ",Part " + (actPartGetter(authorization) || undefinedTextValue) + ",Section " + (actSectionGetter(authorization) || undefinedTextValue);
                    break;
                case "eo":
                    title = "Executive Order - " + (eoTitleGetter(authorization) || undefinedTextValue);
                    break;
            }
            return title;
        }

        function getAccountTitle(account) {
            var title = "test-this-account";

            return title;
        }
    }
})();