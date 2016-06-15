!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('UserProfile', [
        function() {
            /**
             * Translate incoming user object from CFDA User API
             * @constructor
             */
            function UserProfile(user) {
                this.id = user.id;
                this.fullName = user.fullName;
                this.workPhone = user.workPhone;
                this.role = user.role;
                this.email = user.email;
                this.organizationId = user.organizationId;
                this.additionalInfo = user.additionalInfo;
            }

            UserProfile.prototype.getId = function() {
                return this.id;
            };

            UserProfile.prototype.getFullName = function() {
                return this.fullName;
            };

            UserProfile.prototype.getEmail = function() {
                return this.email;
            };

            UserProfile.prototype.getWorkPhone = function() {
                return this.workPhone;
            };

            UserProfile.prototype.getRole = function() {
                return this.role;
            };

            UserProfile.prototype.getOrganizationId = function() {
                return this.organizationId;
            };

            UserProfile.prototype.getAssignedOrganizationIds = function() {
                return this.additionalInfo ? (this.additionalInfo['assignedOrganizationIds'] ? this.additionalInfo['assignedOrganizationIds'] : []) : [];
            };

            UserProfile.prototype.getOrganizationType = function() {
                return this.additionalInfo ? (this.additionalInfo['organizationType'] ? this.additionalInfo['organizationType']['id'] : 'default') : 'default';
            };

            UserProfile.prototype.getOrganizationTypeValue = function() {
                return this.additionalInfo ? (this.additionalInfo['organizationType'] ? this.additionalInfo['organizationType']['value'] : 'User Organization') : 'User Organization';
            };

            UserProfile.prototype.getCustomRoles = function() {
                return this.additionalInfo ? (this.additionalInfo['customRoles'] ? this.additionalInfo['customRoles'] : {}) : {};
            };

            UserProfile.prototype.getCustomRolesValue = function() {
                var customRoles = this.getCustomRoles();
                var r = [];

                angular.forEach(customRoles, function(value) {
                    r.push(value);
                });

                return r;
            };

            /**
             * Return the constructor function
             */
            return UserProfile;
        }
    ]);
}();