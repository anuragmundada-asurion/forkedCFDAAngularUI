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
            descriptionGetter = $parse('description'),
            obligationQuestionRecoveryGetter = $parse('questions.recovery.flag'),
            obligationQuestionSalaryGetter = $parse('questions.salary_or_expense.flag'),
            obligationAddInfoGetter = $parse('additionalInfo.content'),
            tafsDeptGetter = $parse('departmentCode'),
            tafsMainAcctGetter = $parse('accountCode'),
            undefinedTextValue = "";

        return {
            getAuthorizationTitle: getAuthorizationTitle,
            getAccountTitle: getAccountTitle,
            getObligationTitle: getObligationTitle,
            getTafsTitle: getTafsTitle
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
            var title = (accountGetter(account) || undefinedTextValue) + "-" + (descriptionGetter(account) || undefinedTextValue);
            return title;
        }

        function getObligationTitle(obligation) {
            var title = "";
            var year = 2000;
            for (year=2000; year < 2100; year++) {
                var param = 'values.' + year;
                var obligationGetter = $parse(param);
                var data = (obligationGetter(obligation) || undefinedTextValue);

                if (data) {
                    title = title + "FY" + year.toString().substr(2,2);

                    var flagGetter = $parse('flag');
                    var flagGetterData = (flagGetter(data));
                    if (flagGetterData && flagGetterData=='yes') {
                        var getter1 = $parse('actual');
                        var getter1data = (getter1(data));
                        if (getter1data) {
                            title = title + " (actual): " + getter1data;
                        }

                        var getter2 = $parse('estimate');
                        var getter2data = (getter2(data));
                        if (getter2data) {
                            title = title + " (est): " + getter2data;
                        }

                        title = title + ". ";
                    }
                    else if (flagGetterData && flagGetterData=='no') {
                        title = title + ": Not separately identifiable. ";
                    }
                    else if (flagGetterData && flagGetterData=='na') {
                        title = title + ": Not available. ";
                    }
                }
            }

            var recovery = (obligationQuestionRecoveryGetter(obligation) || undefinedTextValue);
            if (recovery=='yes') {
                title = title + "This is a Recovery and Reinvestment Act obligation. ";
            }

            var salary = (obligationQuestionSalaryGetter(obligation) || undefinedTextValue);
            if (salary=='yes') {
                title = title + "This obligation is for salaries and expenses. ";
            }

            var additionalInfo = (obligationAddInfoGetter(obligation) || undefinedTextValue);
            if (additionalInfo) {
                title = title + additionalInfo + " ";
            }

            return title;
        }

        function getTafsTitle(taf) {
            var title = (tafsDeptGetter(taf) || undefinedTextValue) + "-" + (tafsMainAcctGetter(taf) || undefinedTextValue);
            return title;
        }
    }
})();