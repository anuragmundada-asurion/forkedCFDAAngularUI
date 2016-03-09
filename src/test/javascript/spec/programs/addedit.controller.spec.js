'use strict';

describe("Unit Tests for Add Edit Controller", function () {
    var $controller,
        $httpBackend,
        $rootScope,
        $state,
        ProgramFactory,
        util,
        id = '3a98d8c8e9c9';

    beforeEach(function() {
        var coreChoices = {"yes_no":{"yes":{"element_id":"yes","description":"Yes","value":"Yes","code":"yes","elements":null},"no":{"element_id":"no","description":"No","value":"No","code":"no","elements":null}},"yes_na":{"yes":{"element_id":"yes","description":null,"value":"Yes","code":"yes","elements":null},"na":{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}},"yes_no_na":{"yes":{"element_id":"yes","description":"Yes","value":"Yes","code":"yes","elements":null},"no":{"element_id":"no","description":"No","value":"No","code":"no","elements":null},"na":{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}},"authorization_type":{"act":{"element_id":"act","description":null,"value":"Act","code":"act","elements":null},"eo":{"element_id":"eo","description":null,"value":"Executive Order","code":"eo","elements":null},"publiclaw":{"element_id":"publiclaw","description":null,"value":"Public Law","code":"publiclaw","elements":null},"statute":{"element_id":"statute","description":null,"value":"Statute","code":"statute","elements":null},"usc":{"element_id":"usc","description":null,"value":"USC","code":"usc","elements":null}},"$promise":{},"$resolved":true};

        function Program() {
            angular.extend(this, {
                save: function() {},
                update: function() {}
            });
        }

        module(function($provide) {
            $provide.value('coreChoices', coreChoices);
            $provide.value('program', new Program());
        });

        inject(function(_$controller_, _$httpBackend_, _$rootScope_, _util_, _$state_, _ProgramFactory_){
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            ProgramFactory = _ProgramFactory_;
            util = _util_;
            $state = _$state_;
        });

        $httpBackend
            .whenGET('/api/contacts')
            .respond('{"results":[{"dmt@test.com":{"_id":"dmt@test.com","title":"Program Manager DMT Safari Test dmt@test.com","info":"Program Manager,x,DMT Safari Test,x,dmt@test.com,x,1234567897,x,,x,123 Test,x,Test,x,MD,x,20601"}},{"dmt1@test.com":{"_id":"dmt1@test.com","title":"dd dmt1@test.com","info":",x,dd,x,dmt1@test.com,x,1234567,x,,x,ddd,x,ddd,x,KY,x,1233445"}},{"dmt1@test.com":{"_id":"dmt1@test.com","title":"dd dmt1@test.com","info":",x,dd,x,dmt1@test.com,x,1234567,x,,x,ddd,x,ddd,x,KY,x,1233445"}},{"dmt@test.com":{"_id":"dmt@test.com","title":"DMT Safari Test dmt@test.com","info":",x,DMT Safari Test,x,dmt@test.com,x,1234567897,x,,x,123 Test,x,Test,x,MD,x,20601"}},{"jdoe@test.com":{"_id":"jdoe@test.com","title":"Ms John Doe jdoe@test.com","info":"Ms,x,John Doe,x,jdoe@test.com,x,230-123-1231,x,230-122-1311,x,234, Independence Ave,x,Washington DC,x,DC,x,20134"}},{"dmt@test.com":{"_id":"dmt@test.com","title":"DMT Safari Test dmt@test.com","info":",x,DMT Safari Test,x,dmt@test.com,x,1234567897,x,,x,123 Test,x,Test,x,MD,x,20601"}}]}');

        $httpBackend
            .whenGET(/\/api\/programs(\?limit=[\n]+)*/i)
            .respond('{"bde3daabaf5f41ea986e6b421f78    ":{"_id": "bde3daabaf5f41ea986e6b421f78", "title": "0001 test Authorization", "agencyId": "REI Test Agency", "financial": {"accounts": [{"code": "12-1232-3-2-123", "description": "test"}, {"code": "12-1231-2-1-231", "description": "department of somethign"}, {"code": "13-2131-2-3-323"}], "treasury": {"tafs": [{"fy1": "2014", "fy2": "2016", "accountCode": "123-123-123123", "departmentCode": "12323", "subAccountCode": "q2123123", "allocationTransferAgency": "agency department o gkjsd kad"}, {"accountCode": "main code", "departmentCode": "test"}]}, "obligations": [{"values": {"2015": {"flag": "yes", "actual": "12312"}, "2016": {"flag": "yes", "estimate": "3231123"}, "2017": {"flag": "yes", "estimate": "dwqeq"}}, "questions": {"recovery": {"flag": "yes"}, "salary_or_expense": {"flag": "yes", "assistanceType": "0001003"}}, "additionalInfo": {"content": "asd ad ad asdad"}}, {"values": {"2015": {"flag": "na"}, "2016": {"flag": "na"}, "2017": {"flag": "yes"}}, "questions": {"recovery": {"flag": "na"}, "salary_or_expense": {"flag": "na"}}}]}, "relatedTo": [], "projectsArray": [], "authorizations": [{"act": {"part": "part 2", "title": "Animal Welfare Act, as amended, 7 U.S.C 2131-2155; Plant Protection Act, Public Law 106-224, 7 U.S.C 7701-7772; Farm Security and Rural Investment Act of 2002, Public Law 107-171, E U.S.C 10401-10418.Animal Welfare Act, as amended, 7 U.S.C 2131-2155; Plant Protection Act, Public Law 106-224, 7 U.S.C 7701-7772; Farm Security and Rural Investment Act of 2002, Public Law 107-171, E U.S.C 10401-10418.", "section": "section"}, "active": true, "version": 1, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"active": true, "version": 1, "executiveOrder": {"part": "IXX", "title": "Establishing Paid sick leave", "section": "123123"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": true, "version": 1, "publicLaw": {"lawNumber": 123123, "congressCode": "110"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}, {"active": true, "statute": {"page": "32131231", "volume": "123"}, "version": 1, "authorizationId": "92adcf2e-7b91-e21b-9256-ba1e2421cc9d", "authorizationType": "statute"}, {"USC": {"title": "7 US", "section": "132123"}, "active": true, "version": 1, "authorizationId": "131f4e10-c8f5-7d15-2c5f-23a5ff890f14", "authorizationType": "usc"}, {"act": {"part": "qe", "title": "qweqew", "section": "qew"}, "active": false, "version": 2, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"act": {"part": "qeqwe", "title": "qewqw", "section": "qe"}, "active": true, "version": 3, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"active": false, "version": 2, "executiveOrder": {"part": "123", "title": "amend 1`", "section": "12312"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": true, "version": 3, "executiveOrder": {"part": "123", "title": "another amens", "section": "12312312"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": false, "version": 2, "publicLaw": {"lawNumber": 123, "congressCode": "2312"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}, {"active": true, "version": 3, "publicLaw": {"lawNumber": 123, "congressCode": "1231231"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}], "alternativeNames": ["pop name"]}}');

        $httpBackend
            .whenGET(/\/api\/contacts\/[\w]+/i)
            .respond({"results":[{"kathleen.townson@ars.usda.gob":{"_id":"kathleen.townson@ars.usda.gob","title":"Mr Jane Smith kathleen.townson@ars.usda.gob","info":"Mr,x,Jane Smith,x,kathleen.townson@ars.usda.gob,x,000-000-000,x,393939,x,5917 Street,x,Sterling,x,IL,x,20303"}},{"kathleen.townson@ars.usda.gov":{"_id":"kathleen.townson@ars.usda.gov","title":"Grants Management Analyst Kathleen S. Townson kathleen.townson@ars.usda.gov","info":"Grants Management Analyst,x,Kathleen S. Townson,x,kathleen.townson@ars.usda.gov,x,(301) 504-1702.,x,,x,0000 Main Street #00,x,Betsville,x,MD,x,20705"}},{"kathleen.townson@ars.usda.gov":{"_id":"kathleen.townson@ars.usda.gov","title":"Kathleen S. Townson kathleen.townson@ars.usda.gov","info":",x,Kathleen S. Townson,x,kathleen.townson@ars.usda.gov,x,(301) 504-1702.,x,,x,0000 Main Street #00,x,Betsville,x,MD,x,20705"}}]});
        $httpBackend
            .whenGET(/\/api\/dictionaries\?ids=[\w\,]+/i)
            .respond('[{"id":"applicant_types","elements":[{"element_id":"0020","description":null,"value":"U.S. Territories and possessions","code":"24","elements":null},{"element_id":"0001","description":null,"value":"Government - General","code":"09","elements":null},{"element_id":"0003","description":null,"value":"Federal","code":"10","elements":null},{"element_id":"0005","description":null,"value":"Interstate","code":"11","elements":null},{"element_id":"0007","description":null,"value":"Intrastate","code":"12","elements":null},{"element_id":"0040","description":null,"value":"State","code":"13","elements":null},{"element_id":"0009","description":null,"value":"State (includes District of Columbia, public institutions of higher education and hospitals)","code":"14","elements":null},{"element_id":"0011","description":null,"value":"Local (includes State-designated lndian Tribes, excludes institutions of higher education and hospitals","code":"15","elements":null},{"element_id":"0013","description":null,"value":"Sponsored organization","code":"18","elements":null},{"element_id":"0015","description":null,"value":"Public nonprofit institution\/organization (includes institutions of higher education and hospitals)","code":"20","elements":null},{"element_id":"0017","description":null,"value":"Other public institution\/organization","code":"21","elements":null},{"element_id":"0019","description":null,"value":"Federally Recognized lndian Tribal Governments","code":"22","elements":null},{"element_id":"0021","description":null,"value":"U.S. Territories and possessions (includes institutions of higher education and hospitals)","code":"23","elements":null},{"element_id":"0023","description":null,"value":"Non-Government - General","code":"30","elements":null},{"element_id":"0025","description":null,"value":"Individual\/Family","code":"31","elements":null},{"element_id":"0027","description":null,"value":"Minority group","code":"32","elements":null},{"element_id":"0029","description":null,"value":"Specialized group (e.g. health professionals, students, veterans)","code":"33","elements":null},{"element_id":"0031","description":null,"value":"Small business (less than 500 employees)","code":"34","elements":null},{"element_id":"0033","description":null,"value":"Profit organization","code":"35","elements":null},{"element_id":"0035","description":null,"value":"Private nonprofit institution\/organization (includes institutions of higher education and hospitals)","code":"36","elements":null},{"element_id":"0037","description":null,"value":"Quasi-public nonprofit institution\/organization","code":"37","elements":null},{"element_id":"0039","description":null,"value":"Other private institutions\/organizations","code":"38","elements":null},{"element_id":"0041","description":null,"value":"Anyone\/general public","code":"39","elements":null},{"element_id":"0043","description":null,"value":"Native American Organizations (includes lndian groups, cooperatives, corporations, partnerships, associations)","code":"40","elements":null}]},{"id":"assistance_usage_types","elements":[{"element_id":"1","description":null,"value":"No Functional Application\/Unlimited Application","code":"00","elements":null},{"element_id":"2","description":null,"value":"Agriculture\/Forestry\/Fish and Game","code":"12","elements":null},{"element_id":"3","description":null,"value":"Business\/Commerce","code":"14","elements":null},{"element_id":"4","description":null,"value":"Civil Defense\/Disaster Prevention and Relief\/Emergency Preparedness","code":"16","elements":null},{"element_id":"5","description":null,"value":"Communications","code":"18","elements":null},{"element_id":"6","description":null,"value":"Community Development (includes Federal surplus property)","code":"20","elements":null},{"element_id":"7","description":null,"value":"Construction\/Renewal\/Rehabilitation","code":"22","elements":null},{"element_id":"8","description":null,"value":"Consumer Protection","code":"24","elements":null},{"element_id":"9","description":null,"value":"Culture\/Arts\/Humanities","code":"26","elements":null},{"element_id":"10","description":null,"value":"Economic Development","code":"28","elements":null},{"element_id":"11","description":null,"value":"Elementary\/Secondary Education","code":"30","elements":null},{"element_id":"12","description":null,"value":"Employment\/Labor\/Management","code":"32","elements":null},{"element_id":"13","description":null,"value":"Energy","code":"34","elements":null},{"element_id":"14","description":null,"value":"Environment (water, air, solid waste, pesticides, radiation)","code":"36","elements":null},{"element_id":"15","description":null,"value":"Food and Nutrition","code":"38","elements":null},{"element_id":"16","description":null,"value":"Health\/Medical","code":"40","elements":null},{"element_id":"17","description":null,"value":"Higher Education (includes Research)","code":"42","elements":null},{"element_id":"18","description":null,"value":"Housing","code":"44","elements":null},{"element_id":"19","description":null,"value":"Income Security\/Social Service\/Welfare","code":"46","elements":null},{"element_id":"20","description":null,"value":"International (includes Export\/lmport)","code":"48","elements":null},{"element_id":"21","description":null,"value":"Law, Justice, and Legal Services","code":"50","elements":null},{"element_id":"22","description":null,"value":"Libraries\/lnformation\/Statistics","code":"52","elements":null},{"element_id":"23","description":null,"value":"Maritime","code":"54","elements":null},{"element_id":"24","description":null,"value":"Natural Resources (mineral, water, wildlife, land)","code":"56","elements":null},{"element_id":"25","description":null,"value":"Planning","code":"58","elements":null},{"element_id":"26","description":null,"value":"Public Works","code":"60","elements":null},{"element_id":"27","description":null,"value":"Recreation (includes Historic Preservation)","code":"62","elements":null},{"element_id":"28","description":null,"value":"Regional Development","code":"64","elements":null},{"element_id":"29","description":null,"value":"Science and Technology","code":"66","elements":null},{"element_id":"31","description":null,"value":"Training","code":"70","elements":null},{"element_id":"30","description":null,"value":"Transportation","code":"68","elements":null},{"element_id":"33","description":null,"value":"Vocational Education","code":"74","elements":null},{"element_id":"34","description":null,"value":"Vocational Rehabilitation","code":"76","elements":null},{"element_id":"32","description":null,"value":"Youth Development","code":"72","elements":null}]},{"id":"beneficiary_types","elements":[{"element_id":"1","description":null,"value":"Federal","code":"10","elements":null},{"element_id":"2","description":null,"value":"Interstate","code":"11","elements":null},{"element_id":"3","description":null,"value":"Intrastate","code":"12","elements":null},{"element_id":"4","description":null,"value":"State","code":"14","elements":null},{"element_id":"5","description":null,"value":"Local","code":"15","elements":null},{"element_id":"6","description":null,"value":"Sponsored organization","code":"18","elements":null},{"element_id":"7","description":null,"value":"Public nonprofit institution\/organization","code":"20","elements":null},{"element_id":"8","description":null,"value":"Other public institution\/organization","code":"21","elements":null},{"element_id":"9","description":null,"value":"Federally Recognized Indian Tribal Governments","code":"22","elements":null},{"element_id":"10","description":null,"value":"U.S. Territories","code":"23","elements":null},{"element_id":"11","description":null,"value":"Individual\/Family","code":"31","elements":null},{"element_id":"12","description":null,"value":"Minority group","code":"32","elements":null},{"element_id":"13","description":null,"value":"Specialized group (e.g. health professionals, students, veterans)","code":"33","elements":null},{"element_id":"14","description":null,"value":"Small business","code":"34","elements":null},{"element_id":"15","description":null,"value":"Profit organization","code":"35","elements":null},{"element_id":"16","description":null,"value":"Private nonprofit institution\/organization","code":"36","elements":null},{"element_id":"17","description":null,"value":"Quasi-public nonprofit organization","code":"37","elements":null},{"element_id":"18","description":null,"value":"Other private institution\/organization","code":"38","elements":null},{"element_id":"19","description":null,"value":"Anyone\/general public","code":"39","elements":null},{"element_id":"20","description":null,"value":"Native American Organizations","code":"40","elements":null},{"element_id":"21","description":null,"value":"Health Professional","code":"41","elements":null},{"element_id":"22","description":null,"value":"Education Professional","code":"42","elements":null},{"element_id":"23","description":null,"value":"Student\/Trainee","code":"43","elements":null},{"element_id":"24","description":null,"value":"Graduate Student","code":"44","elements":null},{"element_id":"25","description":null,"value":"Scientist\/Researchers","code":"45","elements":null},{"element_id":"26","description":null,"value":"Artist\/Humanist","code":"46","elements":null},{"element_id":"27","description":null,"value":"Engineer\/Architect","code":"47","elements":null},{"element_id":"28","description":null,"value":"Builder\/Contractor\/Developer","code":"48","elements":null},{"element_id":"29","description":null,"value":"Farmer\/Rancher\/Agriculture Producer","code":"49","elements":null},{"element_id":"30","description":null,"value":"Industrialist\/ Business person","code":"50","elements":null},{"element_id":"31","description":null,"value":"Small Business Person","code":"51","elements":null},{"element_id":"32","description":null,"value":"Consumer","code":"52","elements":null},{"element_id":"33","description":null,"value":"Homeowner","code":"53","elements":null},{"element_id":"34","description":null,"value":"Land\/Property Owner","code":"54","elements":null},{"element_id":"35","description":null,"value":"Black","code":"57","elements":null},{"element_id":"36","description":null,"value":"American Indian","code":"58","elements":null},{"element_id":"37","description":null,"value":"Spanish Origin","code":"59","elements":null},{"element_id":"38","description":null,"value":"Asian","code":"60","elements":null},{"element_id":"39","description":null,"value":"Other Non-White","code":"61","elements":null},{"element_id":"40","description":null,"value":"Migrant","code":"62","elements":null},{"element_id":"41","description":null,"value":"U.S. Citizen","code":"63","elements":null},{"element_id":"42","description":null,"value":"Refugee\/Alien","code":"64","elements":null},{"element_id":"43","description":null,"value":"Veteran\/Service person\/Reservist (including dependents","code":"65","elements":null},{"element_id":"44","description":null,"value":"Women","code":"66","elements":null},{"element_id":"45","description":null,"value":"Disabled (e.g. Deaf, Blind, Physically Disabled)","code":"69","elements":null},{"element_id":"46","description":null,"value":"Physically Afflicted (e.g. TB, Arthritis, Heart Disease)","code":"70","elements":null},{"element_id":"47","description":null,"value":"Mentally Disabled","code":"71","elements":null},{"element_id":"48","description":null,"value":"Drug Addict","code":"72","elements":null},{"element_id":"49","description":null,"value":"Alcoholic","code":"73","elements":null},{"element_id":"50","description":null,"value":"Juvenile Delinquent","code":"74","elements":null},{"element_id":"51","description":null,"value":"Preschool","code":"77","elements":null},{"element_id":"52","description":null,"value":"School","code":"78","elements":null},{"element_id":"53","description":null,"value":"Infant (0-5)","code":"76","elements":null},{"element_id":"54","description":null,"value":"Child (6-15)","code":"79","elements":null},{"element_id":"55","description":null,"value":"Youth (16-21)","code":"80","elements":null},{"element_id":"56","description":null,"value":"Senior Citizen (60+)","code":"81","elements":null},{"element_id":"57","description":null,"value":"Unemployed","code":"84","elements":null},{"element_id":"58","description":null,"value":"Welfare Recipient","code":"85","elements":null},{"element_id":"59","description":null,"value":"Pension Recipient","code":"86","elements":null},{"element_id":"60","description":null,"value":"Moderate Income","code":"87","elements":null},{"element_id":"61","description":null,"value":"Low Income","code":"88","elements":null},{"element_id":"62","description":null,"value":"Major Metropolis (over 250,000)","code":"91","elements":null},{"element_id":"63","description":null,"value":"Other Urban","code":"92","elements":null},{"element_id":"64","description":null,"value":"Suburban","code":"93","elements":null},{"element_id":"65","description":null,"value":"Rural","code":"94","elements":null},{"element_id":"66","description":null,"value":"Education (0-8)","code":"96","elements":null},{"element_id":"67","description":null,"value":"Education (9-12)","code":"97","elements":null},{"element_id":"68","description":null,"value":"Education (13+)","code":"98","elements":null}]},{"id":"date_range","elements":[{"element_id":"1","description":null,"value":"From 1 to 15 days","code":"1","elements":null},{"element_id":"2","description":null,"value":"From 15 to 30 days","code":"2","elements":null},{"element_id":"3","description":null,"value":"From 30 to 60 days","code":"3","elements":null},{"element_id":"4","description":null,"value":"From 60 to 90 days","code":"4","elements":null},{"element_id":"5","description":null,"value":"From 90 to 120 days","code":"5","elements":null},{"element_id":"6","description":null,"value":"From 120 to 180 days","code":"6","elements":null},{"element_id":"7","description":null,"value":"> 180 Days","code":"7","elements":null},{"element_id":"8","description":null,"value":"Not Applicable","code":"8","elements":null},{"element_id":"9","description":null,"value":"Other","code":"9","elements":null}]}]');
    });

    describe("Default Add Edit Controller", function() {
        var $scope, controller;

        beforeEach(function(){
            $scope = $rootScope.$new();
            controller = $controller('AddEditProgram as vm', {
                $scope: $scope
            });
        });

        it('should have global methods', function(done) {
            $scope.vm.choices.programs.$promise.finally(done);

            $httpBackend.flush();

            expect($scope.vm).toBeDefined();
            expect($scope.vm.save).toBeDefined();
            expect($scope.vm.saveAndFinishLater).toBeDefined();
        });

        it('should have the ability to cancel changes made and go to programList', function(){
            spyOn($state, 'go');

            controller.cancelForm();
            expect($state.go).toHaveBeenCalledWith('programList');
        });

        it('should have the ability to create new authorizations', function(){
            var authorization = controller.createAuthorization(null, 'eo');

            expect(authorization.authorizationId).toBeDefined();
            expect(authorization.version).toBe(1);
            expect(authorization.authorizationType).toBe('eo');
            expect(authorization.active).toBe(true);
        });

        it("should indicate if the passed object is an authorization in the 'isAuthorization' function.", function(){
            var authorization = controller.createAuthorization();
            expect(controller.exps.isAuthorization(authorization)).toBe(true);

            authorization.version = null;
            expect(controller.exps.isAuthorization(authorization)).toBe(true);
            authorization.version = 2;
            expect(controller.exps.isAuthorization(authorization)).toBe(false);
        });

        it("should generate an authorization key", function(){
            var authorization = controller.createAuthorization(),
                id = authorization.authorizationId,
                version = authorization.version,
                key = controller.exps.generateAuthKey(authorization);

            expect(key).toEqual(id + version);
        });

        it("should have the ability to create amendments from authorization info", function(){
            var authorization = controller.createAuthorization(null, 'eo'),
                amendment = controller.createAmendment(authorization);

            expect(amendment.authorizationId).toBeDefined();
            expect(amendment.version).toBe(2);
            expect(amendment.authorizationType).toBe('eo');
            expect(amendment.active).toBe(true);

            expect(amendment.authorizationId).toEqual(authorization.authorizationId);
        });

        it("should have the ability to tell if an amendment is part of an authorization", function() {
            var authorization = controller.createAuthorization(null, 'eo'),
                partOfAuthFunc = controller.exps.isPartOfAuth(authorization),
                amendment = controller.createAmendment(authorization),
                otherAuthorization = controller.createAuthorization(null, 'act'),
                otherAmendment = controller.createAmendment(otherAuthorization);

            expect(partOfAuthFunc(amendment)).toBe(true);
            expect(partOfAuthFunc(otherAmendment)).toBe(false);
        });

        it("should have the ability to create empty contact objects", function(){
            var contact = controller.createContact();

            expect(contact).toEqual({
                type: 'headquarter'
            });
        });

        it("should have the ability to reveal validations for a particular section", function(){
            expect($scope.vm.validationFlag['info']).toBeUndefined();
            controller.revealValidations('info');
            expect($scope.vm.validationFlag['info']).toBe(true);
        });

        it("should have the ability to open datepickers", function(){
            expect($scope.vm.datepickers['testDatepicker']).toBeUndefined();
            controller.openDatepicker({
                preventDefault: function() {},
                stopPropagation: function() {}
            }, 'testDatepicker');

            expect($scope.vm.datepickers['testDatepicker'].opened).toBe(true);
            $scope.vm.datepickers['testDatepicker'].opened = false;

            controller.openDatepicker({
                preventDefault: function() {},
                stopPropagation: function() {}
            }, 'testDatepicker');
            expect($scope.vm.datepickers['testDatepicker'].opened).toBe(true);
        })
    })
});
