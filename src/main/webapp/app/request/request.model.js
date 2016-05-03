!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('Request', ['$filter',
        function($filter) {
            function Request(r) {
                angular.extend(this, r);
                this._request = r;

                if (r['data']) {
                    this.data = angular.fromJson(r['data']);
                }
            }

            Request.prototype = {
                getRaw: function() {
                    return this._request;
                },
                getProgramNumber: function() {
                    return this.program['programNumber'];
                },
                getData: function() {
                    return this.data;
                },
                getProgramTitle: function() {
                    return this.program['title'];
                },
                getProgramId: function() {
                    return this.programId;
                },
                getFormattedType: function() {
                    return this.requestType['publicValue'];
                },
                getType: function() {
                    return this.requestType['value'];
                },
                getSubmittedDate: function() {
                    return $filter('date')(this.entryDate, 'medium');
                },
                getSubmitter: function() {
                   //  TODO Look up user name in IAM
                    return this.createdBy;
                },
                getReason: function() {
                    return this.reason;
                },
                isCompleted: function() {
                    return this.completed;
                }
            };

            return Request;
        }
    ]);
}();