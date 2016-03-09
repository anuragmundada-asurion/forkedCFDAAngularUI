'use strict';

describe('Unit Tests for the uxForm directive', function() {
    var $document,
        $compile,
        $rootScope,
        util,
        html;

    beforeEach(inject(function(_$document_,_$compile_, _$rootScope_, _util_){
        $document = _$document_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        util = _util_;
        html = '' +
            "<ux-form>" +
                "<field-finder-searchbox></field-finder-searchbox>" +
                "<ux-form-nav></ux-form-nav>" +
                "<ux-form-section state-key='info' section-title='General Information'>" +
                    "<div field-finder-bookmark='000 Title'>" +
                        "<input type='text'>" +
                    "</div>" +
                "</ux-form-section>" +
                "<ux-form-section state-key='contacts' section-title='Contacts'>" +
                    "<div field-finder-bookmark>" +
                        "<h1>100 Contacts</h1>" +
                    "</div>" +
                "</ux-form-section>" +
                "<ux-form-section state-key='review' section-title='Review'>" +
                    "<div field-finder-bookmark title='200 Review' id='my-bookmark'>" +
                    "</div>" +
                "</ux-form-section>" +
            "</ux-form>"
    }));

    function createElement(attrs){
        var element = angular.element(html);

        if(attrs) {
            element.attr(attrs);
        }

        angular.element($document).find('body').append(element);
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        return {
            uxForm: element,
            nav: element.find('ux-form-nav'),
            searchBox: element.find('field-finder-searchbox'),
            bookmark: angular.element(element[0].querySelector("[field-finder-bookmark]")),
            controller: $rootScope.uxForm
        }
    }

    function hasClass(element, cls) {
        return element.attr('class').split(' ').indexOf(cls) !== -1;
    }

    describe('Unit Tests for uxForm directive', function() {
        it("should have global variables defined", function() {
            var element = createElement(),
                controller = element.controller;

            expect(controller.bookmarks).toBeDefined();
            expect(controller.addSection).toBeDefined();
            expect(controller.isSection).toBeDefined();
            expect(controller.goToSection).toBeDefined();
            expect(controller.goToNextSection).toBeDefined();
            expect(controller.goToPreviousSection).toBeDefined();
            expect(controller.onSectionChange).toBeDefined();
            expect(controller.addBookmark).toBeDefined();
            expect(controller.goToBookmark).toBeDefined();
        });

        it("should have the ability to return the sections", function() {
            var element = createElement(),
                sections = element.controller.sections;

            expect(sections).toBeDefined();
            expect(sections.length).toBe(3);
        });

        it("should have the ability to return the first section", function() {
            var element = createElement(),
                sections = element.controller.sections;

            expect(element.controller.firstSection).toBe(sections[0]);
        });

        it("should have the ability to return the last section", function() {
            var element = createElement(),
                sections = element.controller.sections;
            expect(element.controller.lastSection).toBe(sections[sections.length - 1]);
        });

        it("should go to the next section", function() {
            var element = createElement(),
                sections = element.controller.sections;

            element.controller.goToNextSection();
            expect(element.controller.current).toBe(sections[1]);
        });

        it("should not go to the next section if the current section is the last", function() {
            var element = createElement(),
                sections = element.controller.sections;

            element.controller.current = sections[sections.length - 1];
            element.controller.goToNextSection();
            expect(element.controller.current).toBe(sections[sections.length - 1]);
        });

        it("should have the ability to go to the previous section", function() {
            var element = createElement(),
                sections = element.controller.sections;

            element.controller.goToNextSection();
            expect(element.controller.current).toBe(sections[1]);
            element.controller.goToPreviousSection();
            expect(element.controller.current).toBe(sections[0]);
        });
        it("should not go to the previous section if the current section is the first", function() {
            var element = createElement(),
                sections = element.controller.sections;

            expect(element.controller.current).toBe(sections[0]);
            element.controller.goToPreviousSection();
            expect(element.controller.current).toBe(sections[0]);
        });
        it("should allow 'isSection' to return a boolean if given key matches the current section's key", function() {
            var element = createElement();

            expect(element.controller.isSection('info')).toBe(true);
            element.controller.goToNextSection();
            expect(element.controller.isSection('info')).toBe(false);
        });
        it("should prevent current section from being set to unauthorized values", function() {
            var element = createElement(),
                sections = element.controller.sections;

            expect(element.controller.current).toBe(sections[0]);
            element.controller.current = "test";
            expect(element.controller.current).toBe(sections[0]);
            element.controller.current = {};
            expect(element.controller.current).toBe(sections[0]);
            element.controller.current = sections[0];
            expect(element.controller.current).toBe(sections[0]);
        });

        it("should go to any section if a section object has been provided", function() {
            var element = createElement(),
                sections = element.controller.sections;

            element.controller.goToSection(sections[2]);
            expect(element.controller.current).toBe(sections[2]);
        });
    });

    describe('Unit Texts for uxFormSection', function(){
        it("should have the 'go' function defined when added to uxForm", function(){
            var element = createElement(),
                sections = element.controller.sections;

            sections.forEach(function(section){
                expect(section.go).toBeDefined();
            });
        });

        it("should alert uxForm to change the current section to it", function(){
            var element = createElement(),
                sections = element.controller.sections;

            sections[1].go();

            expect(element.controller.current).toBe(sections[1]);
        });
    });

    describe('Unit Texts for fieldFinderBookmark', function(){
        it("should highlight the section if the 'goToElement' function is called", function(){
            var element = createElement(),
                bookmark = element.controller.bookmarks[0];

            expect(bookmark.id).toEqual(element.bookmark.attr('id'));
            bookmark.goToElement();
            $rootScope.$digest();
            expect(hasClass(element.bookmark, 'highlight')).toBe(true);
        });

        it("should remove the 'highlight' class on the 'removeHighlight' function", function(){
            var element = createElement(),
                bookmark = element.controller.bookmarks[0];

            expect(bookmark.id).toEqual(element.bookmark.attr('id'));
            bookmark.goToElement();
            $rootScope.$digest();
            expect(hasClass(element.bookmark, 'highlight')).toBe(true);
            bookmark.removeHighlight();
            expect(hasClass(element.bookmark, 'highlight')).toBe(false);
        });
    });

    describe('Unit Texts for fieldFinderSearchbox', function(){
        it("should populate 'id' and 'for' attributes on compile", function(){
            var element = createElement();
            expect(element.searchBox.find('select').attr('id')).toBeDefined();
            expect(element.searchBox.find('label').attr('for')).toBeDefined();
        })
    });
});