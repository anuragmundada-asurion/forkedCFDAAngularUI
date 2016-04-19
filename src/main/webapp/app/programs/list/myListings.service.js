!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('MyListingsService', ['DTColumnBuilder', 'AuthorizationService', 'PERMISSIONS', '$filter', function(DTColumnBuilder, AuthorizationService, PERMISSIONS, $filter) {
        this.getTitleAnchor = function(data) {
            var status = data['status']['code'];
            var archived = data['archived'];

            if (!archived) {
                if ((status == 'draft' || status == 'rejected') && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS)) {
                    return '<a ui-sref="editProgram({ id: \'' + data['id'] + '\', section: \'review\' })">' + data['text'] + '</a>';
                } else if (status == 'pending' && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS)) {
                    return '<a ui-sref="editProgram({ id: \'' + data['id'] + '\', section: \'review\' })">' + data['text'] + '</a>';
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

        this.getActionContent = function(data) {
            var status = data['status']['code'];
            var archived = data['archived'];

            var buttons = [];
            if (!archived) {
                if ((status === 'draft' || status === 'rejected') && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS)) {
                    buttons.push('<button type="button" title="Edit FAL" ng-click="editProgram(\'' + data['id'] + '\')"><span class="fa fa-pencil"></span></button>');
                } else if (status === 'pending' && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS)) {
                    buttons.push('<button type="button" title="Edit FAL" ng-click="editProgram(\'' + data['id'] + '\')"><span class="fa fa-pencil"></span></button>');
                } else if (status === 'published' && AuthorizationService.authorize(PERMISSIONS.CAN_EDIT_PUBLISHED_PROGRAMS)) {
                    buttons.push('<button type="button" title="Revise FAL" ng-click="reviseProgram(\'' + data['id'] + '\')"><span class="fa fa-pencil"></span></button>');
                }

                if (status === 'draft' && AuthorizationService.authorize(PERMISSIONS.CAN_DELETE_DRAFT_PROGRAMS)) {
                    buttons.push('<button type="button" title="Delete FAL" ng-click="deleteProgram(\'' + data['id'] + '\')"><span class="fa fa-trash-o"></span></button>');
                }

                if (status === 'published' && AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_ARCHIVE)) {
                    buttons.push('<button type="button" title="Request Archive" ng-click="requestArchive(\'' + data['id'] + '\')"><span class="fa fa-folder"></span></button>');
                    buttons.push('<button type="button" title="Request Title Change" ng-click="requestTitleChange(\'' + data['id'] + '\')"><span class="fa fa-i-cursor"></span></button>');
                }
            } else {
                if (AuthorizationService.authorize(PERMISSIONS.CAN_REQUEST_UNARCHIVE)) {
                    buttons.push('<button type="button" title="Request Unarchive" ng-click="requestUnarchive(\'' + data['id'] + '\')"><span class="fa fa-folder-open"></span></button>');
                }
            }

            return buttons.join('');
        };

        this.getRequestActionContent = function(data) {
            var row = data['row'];
            var buttons = [];
            if (row.requestType.value === 'archive_request') {
                if (AuthorizationService.authorize(PERMISSIONS.CAN_PERFORM_ARCHIVE)) {
                    buttons.push('<button type="button" title="Approve Archive Request" ng-click="handleRequest(\'' + row['id'] + '\', \'archive\')"><span class="fa fa-check-circle-o"></span></button>');
                    buttons.push('<button type="button" title="Reject Archive Request" ng-click="handleRequest(\'' + row['id'] + '\', \'archive_reject\')"><span class="fa fa-times-circle"></span></button>');
                }
            } else if (row.requestType.value === 'unarchive_request') {
                if (AuthorizationService.authorize(PERMISSIONS.CAN_PERFORM_UNARCHIVE)) {
                    buttons.push('<button type="button" title="Approve Unarchive Request"ng-click="handleRequest(\'' + row['id'] + '\', \'unarchive\')"><span class="fa fa-check-circle-o"></span></button>');
                    buttons.push('<button type="button" title="Reject Unarchive Request" ng-click="handleRequest(\'' + row['id'] + '\', \'unarchive_reject\')"><span class="fa fa-times-circle"></span></button>');
                }
            } else if (row.requestType.value === 'title_request') {
                if (AuthorizationService.authorize(PERMISSIONS.CAN_PERFORM_TITLE_CHANGE)) {
                    buttons.push('<button type="button" title="Approve Title Change" ng-click="handleRequest(\'' + row['id'] + '\', \'title\')"><span class="fa fa-check-circle-o"></span></button>');
                    buttons.push('<button type="button" title="Reject Title Change" ng-click="handleRequest(\'' + row['id'] + '\', \'title_reject\')"><span class="fa fa-times-circle"></span></button>');
                }
            } else if (row.requestType.value === 'submit') {
                if (AuthorizationService.authorize(PERMISSIONS.CAN_PERFORM_SUBMISSION)) {
                    buttons.push('<button type="button" title="Review Program" ng-click="editProgram(\'' + row['programId'] + '\')"><span class="fa fa-eye"></span></button>');
                }
            }

            return buttons.join('');
        };

        this.getDateContent = function(data) {
            if (data) {
                var date =  $filter('date')(r['entryDate'], 'MMM d, y');
                var time = $filter('date')(r['entryDate'], 'h:mm:ss a');
                return '<span>' + date + '</span> <span>' + time + '</span>';
            } else {
                return '';
            }
        };

        var self = this;
        this.lists = {
            'activePrograms': {
                filters: {
                    'all': {
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
                                .withOption('defaultContent', '')
                                .withOption('render', function(data) {
                                    return self.getActionContent(data);
                                })
                                .withOption('orderable', false),
                            DTColumnBuilder.newColumn('status').withTitle('Status').withOption('defaultContent', '')
                        ]
                    },
                    'draft': {
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
                            DTColumnBuilder.newColumn('action')
                                .withTitle('Action')
                                .withOption('defaultContent', '')
                                .withOption('render', function(data) {
                                    return self.getActionContent(data);
                                })
                                .withOption('orderable', false)
                        ]
                    },
                    'published': {
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
                            DTColumnBuilder.newColumn('publishedDate').withTitle('Date Published').withOption('defaultContent', '')
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
                    'pending': {
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
                            DTColumnBuilder.newColumn('action')
                                .withTitle('Action')
                                .withOption('defaultContent', '')
                                .withOption('render', function(data) {
                                    return self.getActionContent(data);
                                })
                                .withOption('orderable', false)
                        ]
                    },
                    'rejected': {
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
                            DTColumnBuilder.newColumn('action')
                                .withTitle('Action')
                                .withOption('defaultContent', '')
                                .withOption('render', function(data) {
                                    return self.getActionContent(data);
                                })
                                .withOption('orderable', false)
                        ]}
                }
            },
            'archivedPrograms': {
                filters: {
                    'all': {
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
                    }
                }
            },
            'requests': {
                filters: {
                    'all': {
                        columns: [
                            //  TODO Select FAL
                            DTColumnBuilder.newColumn('title')
                                .withTitle('Title')
                                .withOption('defaultContent', '')
                                .withOption('render', function(data) {
                                    return self.getRequestTitleAnchor(data);
                                }),
                            DTColumnBuilder.newColumn('requestType').withTitle('Request Type').withOption('defaultContent', ''),
                            DTColumnBuilder.newColumn('reason').withTitle('Reason').withOption('defaultContent', ''),
                            DTColumnBuilder.newColumn('action')
                                .withTitle('Action')
                                .withOption('defaultContent', '')
                                .withOption('render', function(data) {
                                    return self.getRequestActionContent(data);
                                })
                                .withOption('orderable', false),
                            DTColumnBuilder.newColumn('requestDate').withTitle('Date Requested').withOption('defaultContent', '')
                                .withOption('render', function(data) {
                                    return self.getDateContent(data);
                                })
                        ]
                    }
                }
            }
        };

        this.hasFilter = function(filter) {
            return this.lists[this.currentListId].filters.hasOwnProperty(filter);
        };

        this.hasList = function(list) {
            return this.lists.hasOwnProperty(list);
        };

        this.setList = function(newList) {
            this.currentListId = newList;
            this.setFilter('all');
        };

        this.setFilter = function(newFilter) {
            this.currentFilterId = newFilter;
        };

        this.getCurrentColumns = function() {
            return this.lists[this.currentListId].filters[this.currentFilterId].columns;
        };

        this.isActiveList = function() {
            return this.currentListId === 'activePrograms';
        };

        this.isArchivedList = function() {
            return this.currentListId === 'archivedPrograms';
        };

        this.isRequestList = function() {
            return this.currentListId === 'requests';
        };

        this.searchKeyword = '';
        this.currentListId = 'activePrograms';
        this.currentFilterId = 'all';
    }]);
}();