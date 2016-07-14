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
            templateUrl:'components/controls/multi-entry-sub-form.tpl.html',
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
                var contactResult = item.info;
                $subForm.current.title = contactResult.title;
                $subForm.current.fullName = contactResult.fullName;
                $subForm.current.email = contactResult.email;
                $subForm.current.phone = contactResult.phone;
                $subForm.current.fax = contactResult.fax;
                $subForm.current.address = contactResult.address;
                $subForm.current.city = contactResult.city;
                $subForm.current.state = contactResult.state;
                $subForm.current.zip = contactResult.zip;
            }

            function add() {
                var parentItem = $parentSubForm ? $parentSubForm.current : undefined;
                $subForm.current = scope.createFunction ? scope.createFunction(parentItem) : {};
            }

            function edit(item) {
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
                } else {
                    //console.log("save - else - push to list");
                    list.push($subForm.current);
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