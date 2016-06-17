'use strict';

jasmine.getEnv().topSuite().beforeEach({fn: function() {
    module('templates');
    module('app');
    module(function($provide) {
        $provide.service('ROLES', function() {
            angular.extend(this, {"GSA_CFDA_R_cfdasuperuser":{"permissions":["CanQueryPrograms","CanCreateRegionalOffice","CanEditRegionalOffice","CanDeleteRegionalOffice","CanCreatePrograms","CanEditDraftPrograms","CanDeleteDraftPrograms","CanReviewPrograms","CanViewRequests","CanRequestTitleChange","CanPerformTitleChange","CanRequestAgencyChange","CanPerformAgencyChange","CanRequestArchive","CanPerformArchive","CanRequestUnarchive","CanPerformUnarchive","CanViewArchivedPrograms","CanEditPendingPrograms","CanRequestSubmission","CanRequestSubmissionOutsideRange","CanPerformSubmission","CanEditPublishedPrograms","CanViewOrganizationConfig","CanEditOrganizationConfig","CanViewUsers","CanEditUsers"]},"GSA_CFDA_R_cfda_agency_coord":{"permissions":["CanQueryPrograms","CanCreateRegionalOffice","CanEditRegionalOffice","CanDeleteRegionalOffice","CanCreatePrograms","CanEditDraftPrograms","CanDeleteDraftPrograms","CanReviewPrograms","CanViewRequests","CanRequestTitleChange","CanPerformTitleChange","CanRequestAgencyChange","CanRequestArchive","CanPerformArchive","CanRequestUnarchive","CanPerformUnarchive","CanViewArchivedPrograms","CanRequestSubmission","CanRequestSubmissionOutsideRange","CanEditPublishedPrograms","CanViewOrganizationConfig","CanEditOrganizationConfig","CanViewUsers","CanEditUsers"]},"GSA_CFDA_R_agency_submitter":{"permissions":["CanQueryPrograms","CanCreateRegionalOffice","CanEditRegionalOffice","CanDeleteRegionalOffice","CanDeleteDraftPrograms","CanReviewPrograms","CanViewRequests","CanRequestTitleChange","CanRequestArchive","CanRequestUnarchive","CanViewArchivedPrograms","CanEditPublishedPrograms","CanViewOrganizationConfig","CanViewUsers"]},"GSA_CFDA_R_omb_analyst":{"permissions":["CanQueryPrograms","CanReviewPrograms","CanViewRequests","CanRequestTitleChange","CanRequestArchive","CanRequestUnarchive","CanViewArchivedPrograms","CanEditPendingPrograms","CanPerformSubmission","CanViewOrganizationConfig","CanViewUsers"]},"GSA_CFDA_R_gsa_analyst":{"permissions":[]},"GSA_CFDA_R_rmo_superuser":{"permissions":["CanQueryPrograms","CanEditDraftPrograms","CanReviewPrograms","CanViewRequests","CanRequestTitleChange","CanRequestArchive","CanRequestUnarchive","CanViewArchivedPrograms","CanEditPendingPrograms","CanViewOrganizationConfig","CanEditOrganizationConfig","CanViewUsers","CanEditUsers"]},"GSA_CFDA_R_cfdalimitedsuperuser":{"permissions":["CanQueryPrograms","CanReviewPrograms","CanViewRequests","CanViewArchivedPrograms","CanViewOrganizationConfig","CanViewUsers"]}});
        });
    });
}});

describe('Unit Tests for App Module', function() {
    var $window,
        $document;

    describe("Unit Tests for prototype extensions",function() {
        beforeEach(function() {
            inject(function (_$window_, _$document_) {
                $window = _$window_;
                $document = _$document_;
            });
        });

        describe('Unit Tests for angular.element prototype function additions', function() {
            var prototype,
                element,
                h1Element,
                h2Element,
                inputElement,
                pElement,
                brElement;

            beforeEach(function() {
                prototype = $window.angular.element.prototype;
                element = angular.element('' +
                    "<div>" +
                        "<h1>My Title</h1>" +
                        "<h2>Second Header</h2>" +
                        "<input type='text'>" +
                        "<p>This is a paragraph</p>" +
                        "<br/>" +
                    "</div>");

                angular.element($document.body).append(inputElement);
                h1Element = element.find('h1');
                h2Element = element.find('h2');
                inputElement = element.find('input');
                pElement = element.find('p');
                brElement = element.find('br');
            });

            it('contains additional functions added to the prototype', function() {
                expect(prototype.findAll).toBeDefined();
                expect(prototype.focus).toBeDefined();
                expect(prototype.click).toBeDefined();
                expect(prototype.select).toBeDefined();
                expect(prototype.height).toBeDefined();
            });

            it("should find all matching DOM elements with the 'findAll' function", function(){
                expect(element.findAll("h1").html()).toBe(h1Element.html());
                expectResultToContainElements(element.findAll("h1, h2"), [h1Element, h2Element]);
                expectResultToContainElements(element.findAll("br, p, h1"), [brElement, pElement, h1Element]);
                expectResultToContainElements(element.findAll("div, h2, p"),[h2Element, pElement]);

                //////////

                function expectResultToContainElements(result, elements) {
                    expect(result.length).toBe(elements.length);

                    var expectResult = expect(result);
                    expectResult.toBeDefined();
                    elements.forEach(function(element){
                        expectResult.toContain(element[0]);
                    });
                }
            });

            it("should focus on matching DOM elements for the 'focus' function", function(){
                expectElementOnHandlerToBeCalled(h1Element, 'focus');
                expectElementOnHandlerToBeCalled(h2Element, 'focus');
                expectElementOnHandlerToBeCalled(inputElement, 'focus');
                expectElementOnHandlerToBeCalled(pElement, 'focus');
                expectElementOnHandlerToBeCalled(brElement, 'focus');
            });

            it("should focus on matching DOM elements for the 'click' function", function(){
                expectElementOnHandlerToBeCalled(inputElement, 'click');
            });

            it("should focus on matching DOM elements for the 'select' function", function(){
                expectElementOnHandlerToBeCalled(inputElement, 'select');
            });

            it("should return the height value of the element with the 'height' function", function(){
                expect(element.height()).toBe(element[0].offsetHeight);
                expect(h1Element.height()).toBe(h1Element[0].offsetHeight);
                expect(h2Element.height()).toBe(h2Element[0].offsetHeight);
                expect(inputElement.height()).toBe(inputElement[0].offsetHeight);
                expect(pElement.height()).toBe(pElement[0].offsetHeight);
                expect(brElement.height()).toBe(brElement[0].offsetHeight);
            });

            /////////////////

            function expectElementOnHandlerToBeCalled(element, event) {
                spyOn(element[0], event);
                element[event]();
                expect(element[0][event]).toHaveBeenCalled();
            }
        });
        describe('Unit Tests for String prototype function additions', function() {
            var prototype;

            beforeEach(function(){
                prototype = String.prototype;
            });

            it('contains additional functions added to the prototype', function() {
                expect(prototype.capitalize).toBeDefined();
                expect(prototype.format).toBeDefined();
            });

            it("should capitalize the String when the 'capitalize' function is called", function() {
                expect("mary".capitalize()).toBe("Mary");
                expect("herndon".capitalize()).toBe("Herndon");
                expect("123".capitalize()).toBe("123");
            });

            it("should inject values into the braces depending on argument placement when the 'format' function is called", function(){
                expect("My name is {0}, and I am {1}.".format("Tom", 20)).toBe("My name is Tom, and I am 20.");
                expect("This is a {0} statement.".format(true, "Law")).toBe("This is a true statement.");
                expect("{0} {1} {2} {3} {4} {5}".format("a", "b", "c", 1, 2, 3)).toBe("a b c 1 2 3");
                expect("No formatting here.".format(30, "name")).toBe("No formatting here.");
            });

            it("should leave the braces if there are more injection points then arguments when the 'format' function is called", function(){
                expect("My name is {0}, and I am {1}.".format("Tom")).toBe("My name is Tom, and I am {1}.");
                expect("This is a {0} statement.".format()).toBe("This is a {0} statement.");
                expect("{0} {1} {2} {3} {4} {5}".format("a", "b", "c")).toBe("a b c {3} {4} {5}");
            });
        });
    });
});