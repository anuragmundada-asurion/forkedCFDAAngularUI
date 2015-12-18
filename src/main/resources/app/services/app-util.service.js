(function() {
    "use strict";

    angular
        .module('app')
        .factory('appUtil', appUtilSvc);

    appUtilSvc.$inject = ['$parse'];
    ////////////////

    function appUtilSvc($parse) {
        var congressCodeGetter = $parse('publicLaw.congressCode'),
            volumeGetter = $parse('statute.volume');

        return {
            getAuthorizationTitle: getAuthorizationTitle
        };

        ////////////////////

        function getAuthorizationTitle(authorization) {
            var type = authorization.type,
                title;

            switch (type) {
                case "Public Law":
                    title = "Congress " + congressCodeGetter(authorization);
                    break;
                case "Statute":
                    title = "Statute " + volumeGetter(authorization);
                    break;
                default:
                    title = authorization.title;
            }
            return title;
        }
    }
})();