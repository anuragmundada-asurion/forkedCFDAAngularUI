(function() {
    "use strict";

    angular
        .module('app')
        .factory('util', utilSvc);

    utilSvc.$inject = ['$window'];
    ////////////////

    function utilSvc($window) {
        var crypto = $window.crypto || $window.msCrypto,
            fiscalYearStartMonth = new Date('10/1/2015').getMonth();

        return {
            generateUUID: crypto && crypto.getRandomValues ? generateUUID : generateUUIDPolyfill,
            getFiscalYear: getFiscalYear
        };

        ////////////////////

        function generateUUID() {
            var buf = new Uint16Array(8);
            crypto.getRandomValues(buf);
            return (S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7]));
        }

        function S4(num) {
            var ret = num.toString(16);
            while(ret.length < 4){
                ret = "0"+ret;
            }
            return ret;
        }

        function generateUUIDPolyfill() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        function getFiscalYear(date) {
            date = date || new Date();
            var year = date.getFullYear(),
                month = date.getMonth();
            if(month >= fiscalYearStartMonth)
                year++;
            return year;
        }
    }
})();