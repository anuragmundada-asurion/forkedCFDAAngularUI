(function() {
    "use strict";

    angular
        .module('app')
        .constant('accordionConfig', {
            closeOthers: true
        })
        .directive('usaAccordion', usaAccordion)
        .directive('usaAccordionGroup', usaAccordionGroup)
        .directive('usaAccordionHeading', usaAccordionHeading)
        .directive('usaAccordionTransclude', usaAccordionTransclude);

    usaAccordion.$inject = [];

    //////////////////

    function usaAccordion() {

        usaAccordionController.$inject = ['$scope', '$attrs', 'accordionConfig'];

        return {
            restrict:'EA',
            controller:usaAccordionController,
            controllerAs: 'vm',
            bindToController: true,
            transclude: true,
            replace: false,
            templateUrl: 'partials/components/usa-accordion.tpl.html'
        };

        ///////////////

        function usaAccordionController($scope, $attrs, accordionConfig) {
            var vm = this;

            // This array keeps track of the accordion groups
            vm.groups = [];

            // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
            vm.closeOthers = closeOthers;

            // This is called from the accordion-group directive to add itself to the accordion
            this.addGroup = addGroup;

            // This is called from the accordion-group directive when to remove itself
            this.removeGroup = removeGroup;

            ///////////////////

            function closeOthers(openGroup) {
                var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
                if ( closeOthers ) {
                    angular.forEach(vm.groups, function (group) {
                        if ( group !== openGroup )
                            group.isOpen = false;
                    });
                }
            }
            function addGroup(groupScope) {
                vm.groups.push(groupScope);

                groupScope.$on('$destroy', function () {
                    vm.removeGroup(groupScope);
                });
            }
            function removeGroup(group) {
                var index = vm.groups.indexOf(group);
                if ( index !== -1 )
                    vm.groups.splice(index, 1);
            }
        }
    }

    // The accordion-group directive indicates a block of html that will expand and collapse in an accordion
    function usaAccordionGroup() {
        return {
            require:'^usaAccordion',         // We need this directive to be inside an accordion
            restrict:'EA',
            transclude:true,              // It transcludes the contents of the directive into the template
            replace: true,                // The element containing the directive will be replaced with the template
            templateUrl:'partials/components/usa-accordion-group.tpl.html',
            scope: {
                heading: '@',               // Interpolate the heading attribute onto this scope
                isOpen: '=?',
                isDisabled: '=?'
            },
            controller: usaAccordionGroupController,
            link: link
        };

        ///////////////////

        function link(scope, element, attrs, accordionCtrl) {
            accordionCtrl.addGroup(scope);

            scope.$watch('isOpen', function(value) {
                if ( value ) {
                    accordionCtrl.closeOthers(scope);
                }
            });

            scope.toggleOpen = function() {
                if ( !scope.isDisabled ) {
                    scope.isOpen = !scope.isOpen;
                }
            };
        }

        function usaAccordionGroupController() {
            var vm = this;
            vm.setHeading = setHeading;

            ///////////

            function setHeading(element) {
                vm.heading = element;
            }
        }
    }

    // Use accordion-heading below an accordion-group to provide a heading containing HTML
    // <usa-accordion-group>
    //   <usa-accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
    // </usa-accordion-group>
    function usaAccordionHeading() {
        return {
            restrict: 'EA',
            transclude: true,   // Grab the contents to be used as the heading
            template: '',       // In effect remove this element!
            replace: true,
            require: '^usaAccordionGroup',
            link: link
        };

        ///////////////////

        function link(scope, element, attr, accordionGroupCtrl, transclude) {
            // Pass the heading to the accordion-group controller
            // so that it can be transcluded into the right place in the template
            // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
            accordionGroupCtrl.setHeading(transclude(scope, function () {
            }));
        }
    }

    // Use in the usa-accordion-group template to indicate where you want the heading to be transcluded
    // You must provide the property on the usa-accordion-group controller that will hold the transcluded element
    // <div class="accordion-group">
    //   <div class="accordion-heading" ><a ... usa-accordion-transclude="heading">...</a></div>
    //   ...
    // </div>
    function usaAccordionTransclude() {
        return {
            require: '^usaAccordionGroup',
            link: link
        };

        ///////////////

        function link(scope, element, attr, controller) {
            scope.$watch(function() { return controller[attr.usaAccordionTransclude]; }, function(heading) {
                if ( heading ) {
                    element.html('');
                    element.append(heading);
                }
            });
        }
    }
})();