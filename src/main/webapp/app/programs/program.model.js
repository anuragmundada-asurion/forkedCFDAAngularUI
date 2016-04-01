!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('Program', [function() {
        function Program(program) {
            //  TODO Parse incoming obj
            angular.extend(this, program);
        }

        Program.prototype = {
            getProgramNumber: function() {
                return this.programNumber;
            },
            getStatus: function(){
                return this.status ? this.status : '';
            },
            getId: function() {
                return this._id;
            },
            isArchived: function() {
                return this.archived;
            },
            isDraft: function() {
                return (this.getStatus().toLowerCase() === 'draft' && !this.isArchived()) || !this.getId();
            },
            isRejected: function() {
                return this.getStatus().toLowerCase() === 'rejected' && !this.isArchived();
            },
            isRevision: function() {
                return this.getProgramNumber() && this.isDraft();
            },
            isTitleEditable: function() {
                return (this.isDraft() || this.isRejected()) && !this.isRevision();
            }
        };

        return Program;
    }]);
}();