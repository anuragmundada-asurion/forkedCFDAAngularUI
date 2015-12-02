(function() {
    "use strict"

    angular
        .module('app')
        .factory('uuid', uuidSvc);

    uuidSvc.$inject = ['$window']
    ////////////////

    function uuidSvc($window) {
        var crypto = $window.crypto || $window.msCrypto;

        var svc = {
            generateUUID: crypto && crypto.getRandomValues ? generateUUID : generateUUIDPolyfill
        }

        return svc;

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
    }
})();