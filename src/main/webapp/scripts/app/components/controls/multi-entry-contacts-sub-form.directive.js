//TODO: Need to review this directive

(function() {
    "use strict";

    angular
        .module('app')
        .directive('multiEntryContactsSubForm', multiEntryContactsFormDirective);

    multiEntryContactsFormDirective.$inject = ['util'];

    /////////////////

    function multiEntryContactsFormDirective(util) {
        return {
            restrict: 'E',
            priority: 0,
            transclude: true,
            controller: multiEntryContactsFormController,
            controllerAs: '$subForm',
            templateUrl:'partials/components/controls/multi-entry-sub-form.tpl.html',
            require: ['^multiEntry', 'multiEntryContactsSubForm'],
            scope: {
                createFunction: "=",
                onParentUpdate: "=",
                beforeSave: "=",
                onSave: "=",
                onOpen: "=",
                readOnly: "=",
                onTest: "="
            },
            compile: compile
        };

        function compile(element) {
            element.find('ng-form').attr('name', 'sub-form-' + util.nextId());

            return link;
        }

        ///////////////////

        function multiEntryContactsFormController() {
            var $subForm = this;

        }

        function link(scope, element, attrs, ctrls) {
            var multiEntryCtrl = ctrls[0],
                $subForm = ctrls[1],
                $currentParentPoint = scope.$parent,
                $parentSubForm;

            scope.$ctrl = scope.$ctrl || multiEntryCtrl;

            while($currentParentPoint && !$parentSubForm) {
                if($currentParentPoint.$subForm)
                    $parentSubForm = $currentParentPoint.$subForm;
                else
                    $currentParentPoint = $currentParentPoint.$parent;
            }
            if($parentSubForm) {
                scope.$parentSubForm = $parentSubForm;
                scope.$watch(function(){
                    return $parentSubForm.current;
                }, function(newVal){
                    scope.onParentUpdate(newVal, $subForm.current);
                }, true);
            }

            scope.$subForm = $subForm;

            scope.save = save;
            scope.cancel = clearCurrent;
            scope.selectItem = selectItem;

            multiEntryCtrl.initOpenAddEntryDialog(add);
            multiEntryCtrl.initOpenEditEntryDialog(edit);

            ///////////////////

            var emailList = {};
            var originalEmail = "";

            function selectItem(item) {
                //console.log("selectItem = " + $subForm.current.contactId);
                //console.log("item = " + JSON.stringify(item));
                //console.log("item info = " + item.info);

                //var contactResult = $subForm.current.contactId.split(",x,");
                var contactResult = item.info.split(",x,");
                //console.log("selectItem - originalEmail = " + originalEmail);
                //if (originalEmail != "") {
                //    originalEmail = contactResult[2];
                //}
                $subForm.current.title = contactResult[0];
                $subForm.current.fullName = contactResult[1];
                $subForm.current.email = contactResult[2];
                $subForm.current.phone = contactResult[3];
                $subForm.current.fax = contactResult[4];
                $subForm.current.address = contactResult[5];
                $subForm.current.city = contactResult[6];
                $subForm.current.state = contactResult[7];
                $subForm.current.zip = contactResult[8];
            }

            function add() {
                //emailList = scope.onOpen ? scope.onOpen() : {};

                var parentItem = $parentSubForm ? $parentSubForm.current : undefined;
                $subForm.current = scope.createFunction ? scope.createFunction(parentItem) : {};
            }

            function edit(item) {
                //emailList = scope.onOpen ? scope.onOpen() : {};

                var copy = angular.copy(item);
                copy.$original = item;
                $subForm.current = copy;

                originalEmail = $subForm.current.email;
            }

            function save() {
                var list = multiEntryCtrl.model.$modelValue || [],
                    original = $subForm.current.$original,
                    parentItem = $parentSubForm ? $parentSubForm.current : undefined;
                (scope.beforeSave || angular.noop)($subForm.current, parentItem);

                //console.log("save - originalEmail = " + originalEmail);
                /*if (!validateDuplicateEmail()) {
                    this.emailDuplicateError = "true";
                    return;
                }*/
                // Validation for duplicate email within agency
                if ($subForm.current.email != originalEmail) {
                    for (var i = 0; i < list.length; i++) {
                        //console.log("   email: " + list[i].email);
                        if ($subForm.current.email == list[i].email) {
                            this.emailDuplicateError = "true";
                            return;
                        }
                    }
                }

                $subForm.current.contactId = $subForm.current.email;
                delete $subForm.current.$original;
                var contacts = scope.onTest ? scope.onTest.choices.contacts : [];

                if (original) {
                    //console.log("save - if(original)");
                    var index = list.indexOf(original);
                    list[index] = $subForm.current;
                    // Update contacts drop down list
                    for (var i=0; i<contacts.length; i++) {
                        if (originalEmail == contacts[i]._id) {
                            contacts[i]._id = $subForm.current.email;
                            contacts[i].title = "" + $subForm.current.title + " " + $subForm.current.fullName + " " + $subForm.current.email;
                            contacts[i].info = $subForm.current.title + ",x," + $subForm.current.fullName + ",x," + $subForm.current.email + ",x," +
                                $subForm.current.phone + ",x," + $subForm.current.fax + ",x," + $subForm.current.address + ",x," +
                                $subForm.current.city + ",x," + $subForm.current.state + ",x," + $subForm.current.zip;
                        }
                    }
                } else {
                    //console.log("save - else - push to list");
                    list.push($subForm.current);
                    // Update contacts drop down list
                    var newContact = '{"' + $subForm.current.email + '":{"_id":"' + $subForm.current.email + '","title":"' + $subForm.current.title
                        + '","info":"' + $subForm.current.title + ",x," + $subForm.current.fullName + ",x," + $subForm.current.email + ",x," +
                        $subForm.current.phone + ",x," + $subForm.current.fax + ",x," + $subForm.current.address + ",x," +
                        $subForm.current.city + ",x," + $subForm.current.state + ",x," + $subForm.current.zip + '"}}';
                    contacts.push(newContact);
                }
                originalEmail = "";

                multiEntryCtrl.model.$setViewValue(list);
                multiEntryCtrl.model.$render();
                (scope.onSave || angular.noop)($subForm.current, parentItem);
                clearCurrent();
            }

            function clearCurrent() {
                originalEmail = "";
                $subForm.current = null;
                multiEntryCtrl.closeEntryDialog();
            }

            function validateDuplicateEmail() {
                var emailJSON = JSON.parse(JSON.stringify(emailList));
                var emailRawList = emailJSON['results'];
                if ((originalEmail != $subForm.current.email) || originalEmail == "") {
                    var duplicateEmailExists = false;
                    for (var i = 0; i < emailRawList.length; i++) {
                        if (emailRawList[i].em == $subForm.current.email) {
                            duplicateEmailExists = true;
                            break;
                        }
                    }
                    if (duplicateEmailExists) {
                        return false;
                    }
                }
                return true;
            }
        }
    }

})();