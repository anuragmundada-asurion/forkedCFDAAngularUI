'use strict';

describe("Unit Tests for Programs List Controller", function () {
    var programsListController;

    beforeEach(function() {
        module('app');
        inject(function(_ProgramsListController_){
            programsListController = _ProgramsListController_;
        });
    });

    it('generate uuid in the correct format', function(){
        var uuid = utilSvc.generateUUID();
        expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
    });
});
