!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('User', ['ROLES', 'SUPPORTED_ROLES', 'PERMISSIONS',
        function(ROLES, SUPPORTED_ROLES, PERMISSIONS) {
            /**
             * Translate incoming user object from CFDA User API
             * @constructor
             */
            function User(user) {
                this.id = user.id;
                this.fullName = user.fullName;
                this.workPhone = user.workPhone;
                this.role = user.role;
                this.email = user.email;
                this.organizationId = user.organizationId;
                this.additionalInfo = user.additionalInfo;

                this.permissions = ROLES[this.role]['permissions'];

                if (angular.equals(this.role, SUPPORTED_ROLES.AGENCY_USER)) {
                    var self = this;
                    angular.forEach(this.getCustomRoles(), function(v, k) {
                        if (PERMISSIONS[k]) {
                            self.permissions.push(PERMISSIONS[k]);
                        }
                    });
                }
            }

            User.prototype.getId = function() {
                return this.id;
            };

            User.prototype.getFullName = function() {
                return this.fullName;
            };

            User.prototype.getEmail = function() {
                return this.email;
            };

            User.prototype.getWorkPhone = function() {
                return this.workPhone;
            };

            User.prototype.getRole = function() {
                return this.role;
            };

            User.prototype.getOrganizationId = function() {
                return this.organizationId;
            };

            User.prototype.getAdditionalInfo = function() {
                return this.additionalInfo ? this.additionalInfo : null;
            };

            User.prototype.getAssignedOrganizationIds = function() {
                return this.getAdditionalInfo() ? this.getAdditionalInfo()['assignedOrganizationIds'] : [];
            };

            User.prototype.getOrganizationType = function() {
                return this.getAdditionalInfo() ? this.getAdditionalInfo()['organizationType'] : null;
            };

            User.prototype.getOrganizationTypeId = function() {
                return this.getOrganizationType() ? this.getOrganizationType()['id'] : 'default';
            };

            User.prototype.getOrganizationTypeValue = function() {
                return this.getOrganizationType() ? this.getOrganizationType()['value'] : 'User Organization';
            };

            User.prototype.getCustomRoles = function() {
                return this.getAdditionalInfo() ? this.getAdditionalInfo()['customRoles'] : {};
            };

            User.prototype.getCustomRolesValue = function() {
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
            return User;
        }
    ]);
}();