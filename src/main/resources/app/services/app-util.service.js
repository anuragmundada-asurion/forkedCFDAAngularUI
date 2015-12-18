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
            undefinedTextValue = "___";

        return {
            getAuthorizationTitle: getAuthorizationTitle
        };

        ////////////////////

        function getAuthorizationTitle(authorization) {
            var type = authorization.type,
                title;

            switch (type) {
                case "Public Law":
                    title = "Public Law " + (congressCodeGetter(authorization) || undefinedTextValue) + "-" + (lawNumberGetter(authorization) || undefinedTextValue);
                    break;
                case "Statute":
                    title = (volumeGetter(authorization) || undefinedTextValue) + " Stat. " + (pageGetter(authorization) || undefinedTextValue);
                    break;
                case "U.S.C.":
                    title = uscTitleGetter(authorization);
                    break;
                default:
                    title = authorization.title;
            }
            return title;
        }
    }
})();