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
                this.assignedOrganizationIds = user.assignedOrganizationIds;
                this.organizationType = user.organizationType;
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
                return this.assignedOrganizationIds ? this.assignedOrganizationIds : [];
            };

            UserProfile.prototype.getOrganizationType = function() {
                return this.organizationType ? this.organizationType : 'default';
            };

            UserProfile.prototype.getOrganizationTypeValue = function() {
                return this.organizationType == 'custom' ? 'Custom Organizations' : (this.organizationType == 'all' ? 'All Organizations' : 'User Organization');
            };

            /**
             * Return the constructor function
             */
            return UserProfile;
        }
    ]);
}();