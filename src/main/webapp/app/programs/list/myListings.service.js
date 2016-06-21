!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('MyListingsService', ['DTColumnBuilder', 'AuthorizationService', 'PERMISSIONS', '$filter', 'SUPPORTED_ROLES', function(DTColumnBuilder, AuthorizationService, PERMISSIONS, $filter, SUPPORTED_ROLES) {
        this.getTitleAnchor = function(data) {
            var status = data['status']['code'];
            var archived = data['archived'];

            if (!archived) {
                if ((status == 'draft' || status == 'rejected') && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS)) {
                    return '<a ui-sref="editProgram({ id: \'' + data['id'] + '\', section: \'review\' })">' + data['text'] + '</a>';
                } else if (status == 'pending') {
                    var isNew = data['parentProgramId'] ? false : true;
                    if (AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS)) {
                        return '<a style="float:left; width:60%;" ui-sref="editProgram({ id: \'' + data['id'] + '\', section: \'review\' })">' + data['text'] + '</a>' + (isNew ? '<img style="float:right; width:40px; margin-top: -15px;" src="/img/img_cfda/new_icon.svg" />' : '');
                    }
                    return '<a style="float:left; width:60%;" ui-sref="reviewProgram({ id: \'' + data['id'] + '\' })">' + data['text'] + '</a>' + (isNew ? '<img style="float:right; width:40px; margin-top: -15px;" src="/img/img_cfda/new_icon.svg" />' : '');
                } else {
                    return '<a ui-sref="reviewProgram({ id: \'' + data['id'] + '\' })">' + data['text'] + '</a>';
                }
            } else {
                return '<a ui-sref="reviewProgram({ id: \'' + data['id'] + '\' })">' + data['text'] + '</a>';
            }
        };

        this.getRequestTitleAnchor = function(data) {
            var program = data['program'];
            if (!program.archived && program.status === 'pending' && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS)) {
                return '<a ui-sref="editProgram({ id: \'' + data['programId'] + '\', section: \'review\' })">' + program['title'] + '</a>';
            } else {
                return '<a ui-sref="reviewProgram({ id: \'' + data['programId'] + '\' })">' + program['title'] + '</a>';
            }
        };

        this.getRequestTypeAnchor = function(data) {
            return '<a ui-sref="viewRequest({ id: \'' + data['id'] + '\' })">' + data['type'] + '</a>';
        };

        this.getActionContent = function(data) {
            var status = data['status']['code'];
            var archived = data['archived'];

            var buttons = [];
            if (!archived) {
                if ((status === 'draft' || status === 'rejected') && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS)) {
                    buttons.push('<button class="usa-button-compact" type="button" title="Edit FAL" ng-click="editProgram(\'' + data['id'] + '\')"><span class="fa fa-pencil"></span></button>');
                } else if (status === 'pending' && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS)) {
                    buttons.push('<button class="usa-button-compact" type="button" title="Edit FAL" ng-click="editProgram(\'' + data['id'] + '\')"><span class="fa fa-pencil"></span></button>');
                } else if (status === 'published' && (AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_PUBLISHED_PROGRAMS) || (AuthorizationService.authorizeByRole(SUPPORTED_ROLES.AGENCY_USER && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS))))) {
                    buttons.push('<button class="usa-button-compact" type="button" title="Revise FAL" ng-click="reviseProgram(\'' + data['id'] + '\')"><span class="fa fa-pencil"></span></button>');
                }

                if (status === 'draft' && AuthorizationService.authorize(PERMISSIONS.CAN_DELETE_DRAFT_PROGRAMS)) {
                    buttons.push('<button class="usa-button-compact" type="button" title="Delete FAL" ng-click="deleteProgram(\'' + data['id'] + '\')"><span class="fa fa-trash-o"></span></button>');
                }

                if (status === 'published' && (AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_ARCHIVE) || AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_TITLE_CHANGE) || AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_AGENCY_CHANGE))) {
                    var actions = '<div class="ui icon top left pointing jqChangeRequest dropdown button primary">'+
                        '<i class="fa fa-caret-square-o-down"></i>'+
                        '<div class="menu" style="font-size: 1.7rem;">'+
                          '<div class="header">Make a request</div>';

                    if(AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_ARCHIVE)){
                        actions += '<div class="item" ng-click="requestArchive(\'' + data['id'] + '\')">Archive</div>';
                    }
                    if(AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_TITLE_CHANGE)){
                        actions += '<div class="item" ng-click="requestTitleChange(\'' + data['id'] + '\')">Title Change</div>';
                    }
                    if(AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_AGENCY_CHANGE)){
                        actions += '<div class="item" ng-click="requestAgencyChange(\'' + data['id'] + '\')">Agency Change</div>';
                    }

                    actions += '</div>'+
                            '</div>';
                    buttons.push(actions);
                }
            } else {
                if (AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_UNARCHIVE)) {
                    buttons.push('<button class="usa-button-compact" type="button" title="Request Unarchive" ng-click="requestUnarchive(\'' + data['id'] + '\')"><span class="fa fa-folder-open"></span></button>');
                }
            }

            return buttons.join('');
        };

        this.getRequestActionContent = function(data) {
            return '<a ui-sref="viewRequest({ id: \'' + data + '\' })" class="usa-button usa-button-compact" title="Review Program"><span class="fa fa-eye"></span></a>';
        };

        this.getDateContent = function(data) {
            if (data) {
                var date =  $filter('date')(data, 'MMM d, y');
                var time = $filter('date')(data, 'h:mm:ss a');
                return '<span>' + date + '</span> <span>' + time + '</span>';
            } else {
                return '';
            }
        };

        var self = this;
        this.lists = {
            'activePrograms': {
                columns: [
                    //  TODO Select FAL
                    DTColumnBuilder.newColumn('programNumber').withTitle('FAL #').withOption('defaultContent', ''),
                    DTColumnBuilder.newColumn('title')
                        .withTitle('Title')
                        .withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getTitleAnchor(data);
                        }),
                    DTColumnBuilder.newColumn('organization').withTitle('Department/Sub-Tier Agency & Office').withOption('defaultContent', ''),
                    DTColumnBuilder.newColumn('submittedDate').withTitle('Date Submitted').withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getDateContent(data);
                        }),
                    DTColumnBuilder.newColumn('publishedDate').withTitle('Date Published').withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getDateContent(data);
                        }),
                    DTColumnBuilder.newColumn('action')
                        .withTitle('Action')
                        .withOption('width', '200px')
                        .withOption('className', 'status')
                        .withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getActionContent(data);
                        })
                        .withOption('orderable', false),
                    DTColumnBuilder.newColumn('status').withTitle('Status').withOption('defaultContent', '')
                ]
            },
            'archivedPrograms': {
                columns: [
                    //  TODO Select FAL
                    DTColumnBuilder.newColumn('programNumber').withTitle('FAL #').withOption('defaultContent', ''),
                    DTColumnBuilder.newColumn('title')
                        .withTitle('Title')
                        .withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getTitleAnchor(data);
                        }),
                    DTColumnBuilder.newColumn('organization').withTitle('Department/Sub-Tier Agency & Office').withOption('defaultContent', ''),
                    DTColumnBuilder.newColumn('archivedDate').withTitle('Date Archived').withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getDateContent(data);
                        }),
                    DTColumnBuilder.newColumn('action')
                        .withTitle('Action')
                        .withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getActionContent(data);
                        })
                        .withOption('orderable', false)
                ]
            },
            'requests': {
                columns: [
                    //  TODO Select FAL
                    DTColumnBuilder.newColumn('title')
                        .withTitle('Title')
                        .withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getRequestTitleAnchor(data);
                        }),
                    DTColumnBuilder.newColumn('requestType')
                        .withTitle('Request Type')
                        .withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getRequestTypeAnchor(data);
                        }),
                    DTColumnBuilder.newColumn('reason').withTitle('Reason').withOption('defaultContent', ''),
                    DTColumnBuilder.newColumn('action')
                        .withTitle('Action')
                        .withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getRequestActionContent(data);
                        })
                        .withOption('orderable', false),
                    DTColumnBuilder.newColumn('entryDate').withTitle('Date Requested').withOption('defaultContent', '')
                        .withOption('render', function(data) {
                            return self.getDateContent(data);
                        })
                ]
            }
        };

        this.hasList = function(list) {
            return this.lists.hasOwnProperty(list);
        };

        this.getColumns = function(listId) {
            return this.lists[listId].columns;
        };
    }]);
}();
