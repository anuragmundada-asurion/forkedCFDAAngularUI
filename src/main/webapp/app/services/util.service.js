!function() {
    'use strict';

    angular.isUndefinedOrNull = function(val) {
        return angular.isUndefined(val) || val === null;
    };

    var myApp = angular.module('app');

    myApp.service('util', ['$window',
        function($window) {
            var crypto = $window.crypto || $window.msCrypto;

            this.fiscalYearStartMonth = new Date('10/1/2015').getMonth();
            this.currentId = 0;

            function S4(num) {
                var ret = num.toString(16);
                while(ret.length < 4){
                    ret = "0"+ret;
                }
                return ret;
            }

            if (crypto && crypto.getRandomValues) {
                this.generateUUID = function() {
                    var buf = new Uint16Array(8);
                    crypto.getRandomValues(buf);
                    return (S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7]));
                };
            } else {
                this.generateUUID = function() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                        return v.toString(16);
                    });
                };
            }

            this.getFiscalYear = function(date) {
                date = date || new Date();
                var year = date.getFullYear(),
                    month = date.getMonth();
                if(month >= this.fiscalYearStartMonth)
                    year++;
                return year;
            };

            this.nextId = function() {
                return ++this.currentId;
            };
        }
    ]);
}();