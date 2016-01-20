(function() {
    "use strict";

    angular
        .module('app')
        .directive('uxForm', UxFormDirective);

    //////////////////

    function UxFormDirective() {

        UxFormController.$inject = ['$attrs', '$injector', '$document', '$timeout'];

        return {
            restrict: 'AE',
            controller: UxFormController,
            controllerAs: 'uxForm',
            bindToController: true
        };

        ///////////////////////

        function UxFormController($attrs, $injector, $document, $timeout) {
            var self = this,
                sections = [],
                _previousSection,
                _currentSection,
                $stateParams,
                $state,
                urlSectionParamName = $attrs.useUiRouter,
                scrollAnchor = $attrs.scrollAnchor || 'ux-form',
                isUsingUiRouter = !!urlSectionParamName;

            if(isUsingUiRouter) {
                $stateParams = $injector.get('$stateParams');
                $state = $injector.get('$state');
            }

            Object.defineProperty(self, 'current', {
                enumerable: true,
                get: getCurrentSection,
                set: setCurrentSection
            });
            Object.defineProperty(self, 'sections', {
                enumerable: true,
                get: getSections,
            });

            angular.extend(self, {
                addSection: addSection,
                goToSection: goToSection,
                goToNextSection: goToNextSection,
                goToPreviousSection: goToPreviousSection
            });

            //////////////////

            function getCurrentSection() {
                return _currentSection;
            }

            function getSections() {
                return sections;
            }

            function setCurrentSection(section) {
                if(section === _currentSection)
                    return;

                if(angular.isObject(section))
                    section = sections.indexOf(section);
                if(angular.isNumber(section) && section >= 0) {
                    _previousSection = _currentSection;
                    _currentSection = sections[section];
                }
                else
                    return;

                goToSection(sections[section]);
            }

            function addSection(section) {
                sections.push(section);
                section.go = function(canScroll) {
                    if(angular.isUndefined(canScroll))
                        canScroll = true;

                    self.current = section;
                    if(canScroll)
                        $document.scrollToElementAnimated($document.findAll(scrollAnchor));
                };

                Object.defineProperty(section, 'selected', {
                    enumerable: true,
                    get: function() {
                        return self.current === section;
                    }
                });

                if(!self.current)
                    section.go(false);

                if(isUsingUiRouter) {
                    var stateKey = $stateParams[urlSectionParamName];
                    if(stateKey === section.stateKey)
                        section.go(false);
                }
            }

            function goToSection(section) {

                if(isUsingUiRouter) {
                    var stateName = $state.current.name,
                        stateParams = angular.copy($stateParams),
                        newParams = {};
                    newParams[urlSectionParamName] = section.stateKey;

                    $state.go(stateName, angular.extend(stateParams, newParams), {
                        notify: false
                    });
                }
            }

            function goToNextSection() {
                var nextIndex = sections.indexOf(self.current) + 1;
                if(nextIndex < sections.length)
                    goToSection(sections[nextIndex]);
            }

            function goToPreviousSection() {
                var previousIndex = sections.indexOf(self.current) - 1;
                if(previousIndex >= 0)
                    goToSection(sections[previousIndex]);
            }
        }
    }
})();