'use strict';

describe('Unit Tests for Public View FAL:', function () {
    //dependencies to be injected
    var $state,
        $stateParams,
        $rootScope,
        $httpBackend,
        $scope,
        $controller,
        User,
        UserService,
        ProgramFactory;

    //helper function
    function changeState(state, params) {
        $state.go(state, params);
        $rootScope.$digest();
    }

    //helper variable
    var testId = '66d1d2645f8acd25c2e79bb60b7342da';

    beforeEach(function () {
        inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$state_, _$stateParams_, _User_, _UserService_, _ProgramFactory_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $state = _$state_;
            $stateParams = _$stateParams_;
            User = _User_;
            UserService = _UserService_;
            ProgramFactory = _ProgramFactory_;
        });

        UserService.changeUser({"roles": ["GSA_CFDA_R_cfdasuperuser"]});


        //set up the mock backend service... it returns this json
        var responseJson = "{\"id\":\"66d1d2645f8acd25c2e79bb60b7342da\",\"data\":{\"award\":{\"procedures\":{\"content\":\"A peer review panel considers each proposal, evaluates the qualifications of applicants in line with research to be undertaken and determines priority for final negotiations of the grant.\"}},\"title\":\"Agricultural Research_Basic and Applied Research\",\"usage\":{\"rules\":{\"content\":\"Research is conducted that is in cooperation with and is correlated with the Agricultural Research Service\'s in-house research programs and projects.  Limited discretionary research funds are periodically made available.\"},\"loanTerms\":{\"flag\":\"na\"},\"restrictions\":{\"flag\":\"na\"},\"discretionaryFund\":{\"flag\":\"na\"}},\"website\":\"http:\/\/www.ars.usda.gov\",\"contacts\":{\"list\":[{\"zip\":\"20705\",\"city\":\"Beltsville\",\"type\":\"headquarter\",\"email\":\"kathleen.townson@ars.usda.gov\",\"phone\":\"(301) 504-1702.\",\"state\":\"MD\",\"title\":\"Grants Management Analyst\",\"address\":\"5601 Sunnyside Ave, MS-5110\",\"country\":\"US\",\"fullName\":\"Kathleen S. Townson,\"}],\"local\":{\"flag\":\"appendix\",\"additionalInfo\":{\"content\":\"See the Agricultural Research Service Regional Offices listed in Appendix IV of the Catalog.\"}}},\"projects\":{\"flag\":\"no\"},\"financial\":{\"accounts\":[{\"code\":\"12-1400-0-1-352\"}],\"treasury\":{\"tafs\":[{\"accountCode\":\"12-1400\",\"departmentCode\":\"12\"}]},\"obligations\":[{\"values\":{\"2014\":{\"actual\":31391667,\"estimate\":33000000},\"2015\":{\"estimate\":33000000},\"2016\":{\"estimate\":33000000}},\"questions\":{\"recovery\":{\"flag\":\"na\"},\"salary_or_expense\":{\"flag\":\"na\"}},\"additionalInfo\":{},\"assistanceType\":\"0003003\"}],\"additionalInfo\":{\"content\":\"$1,000 to $25,000.  Average $15,000\"}},\"objective\":\"To make agricultural research discoveries, evaluate alternative ways of attaining research goals, and provide scientific technical information.\",\"postAward\":{\"audit\":{\"flag\":\"yes\",\"content\":\"As performed by cognizant audit agency.\",\"questions\":{\"OMBCircularA133\":{\"flag\":\"yes\"}}},\"records\":{\"content\":\"Financial records, supporting documents, statistical records, and all other records pertinent to an award shall be retained for a period of three years from the date of submission of the final expenditure report or, for awards that are renewed quarterly or annually, from the date of the submission of the quarterly or annual financial report, as authorized by the Federal awarding agency.\"},\"reports\":{\"flag\":\"yes\",\"list\":{\"cash\":{\"flag\":\"na\"},\"program\":{\"flag\":\"yes\",\"content\":\"Progress reports, final technical reports, financial statements, and inventions and subaward reports.\"},\"progress\":{\"flag\":\"na\"},\"expenditure\":{\"flag\":\"na\"},\"performanceMonitoring\":{\"flag\":\"na\"}}},\"documents\":{\"flag\":\"yes\",\"content\":\"7 CFR 3015 and 7 CFR 3019.\"},\"accomplishments\":{\"flag\":\"na\",\"list\":{\"2014\":{\"content\":{}},\"2015\":{\"content\":{}},\"2016\":{\"content\":{}}}}},\"assistance\":{\"moe\":{\"flag\":\"na\"},\"formula\":{\"flag\":\"no\"},\"matching\":{\"flag\":\"na\"},\"limitation\":{\"awarded\":\"other\",\"content\":\"None\"}},\"fiscalYear\":2015,\"application\":{\"deadlines\":{\"appeal\":{\"interval\":\"9\",\"otherInfo\":{\"content\":\"None\"}},\"renewal\":{\"interval\":\"9\",\"otherInfo\":{\"content\":\"None\"}},\"approval\":{\"interval\":\"9\"},\"submission\":{\"flag\":\"no\"}},\"procedures\":{\"additionalInfo\":{\"content\":\"Letters should be submitted to the Agricultural Research Service, Department of Agriculture. Give name of applicants, location of facilities, and State of incorporation, if any.\"}},\"selectionCriteria\":{\"flag\":\"yes\",\"content\":\"Peer review.\"}},\"eligibility\":{\"applicant\":{\"types\":[\"0041\"],\"additionalInfo\":{\"content\":\"Usually nonprofit institutions of higher education or other nonprofit research organizations, whose primary purpose is conducting scientific research.\"},\"assistanceUsageTypes\":[\"22\"]},\"beneficiary\":{\"types\":[\"19\",\"7\"],\"additionalInfo\":{\"content\":\"Usually nonprofit institutions of higher education or other nonprofit research organizations, whose primary purpose is conducting scientific research.\"}},\"documentation\":{\"flag\":\"na\"}},\"programNumber\":\"10.001\",\"authorizations\":[{\"USC\":{\"title\":\"7\",\"section\":\"427-427i, 1624\"},\"act\":{\"description\":\"Food Security Act of 1985\"},\"version\":1,\"publicLaw\":{\"number\":\"198\",\"congressCode\":\"99\"},\"authorizationId\":\"c775cdfa0de8e6ef557ee48920116318\",\"authorizationType\":\"publiclaw\"}],\"organizationId\":\"e9c3af2c5ece7d62bd3a29d957152c84\",\"preApplication\":{\"coordination\":{\"flag\":\"yes\",\"questions\":{\"ExecutiveOrder12372\":{\"flag\":\"no\"}},\"environmentalImpact\":{\"flag\":\"no\"}}},\"relatedPrograms\":{\"flag\":\"yes\",\"relatedTo\":[\"07ed0ddb6a41a43e1fb11887dda677f6\",\"190044087999f1e3b1abe49cad4e0be0\",\"6aac5ca2d5adf8d3e369b86d4c0823c5\",\"bd19f77b4f3b41f7619ae77a165f9a1d\",\"c5d41a2c08913a7438e28d464e609835\",\"d10084bc379a420f8ea52500f71a424b\",\"d10eb3bbfd5a6c96ece5dc26631090a6\",\"f201edc7e6232a057f51464901b64231\",\"f5e7c50d38232da169fb62759382df2e\"]},\"alternativeNames\":[\"(Extramural Research)\"],\"_id\":\"66d1d2645f8acd25c2e79bb60b7342da\",\"status\":\"Published\",\"archived\":false},\"parentProgramId\":\"f506ebab3ece4e3fc43ea56bd60ba987\",\"latest\":true,\"fiscalYearLatest\":true,\"publishedDate\":1439553318000,\"modifiedDate\":1449508171000,\"submittedDate\":1241197347000,\"status\":{\"code\":\"published\",\"value\":\"Published\"},\"archived\":false}";
        $httpBackend.whenGET('/api/programs/66d1d2645f8acd25c2e79bb60b7342da').respond(responseJson);
    });

    describe('Controller Tests:', function () {
        it('should receive a program, which is not null, from ProgramFactory', function () {
            var program = ProgramFactory.get({id: testId});
            $httpBackend.flush();
            expect(program).toBeDefined();
            //can not say program.id because the response from the programfactory doesnt have the full response json above.
            // the programfactory tranforms the response to just contain the data before returning it.
            expect(program._id).toEqual(testId);
        });


        it('should change the state to ViewProgram', function () {
            changeState('viewProgram', {id: testId});
            expect($state.is('viewProgram')).toBe(true);
            expect($stateParams.id).toEqual(testId);
        });

        it('should populate $scope.onPreviewPage inside the controller', function () {
            //set up the controller
            $scope = {};//$rootScope.$new();
            //change state; the controller relies on state obj.
            changeState('viewProgram', {id: testId});
            //instantiate controller with dependencies; this will populate the $scope object appropriately
            $controller('ViewProgramCtrl', {$scope: $scope});
            //$httpBackend.flush();
            expect($scope.onPreviewPage).toEqual(false);
            //console.log("$scope: ", $scope);
            //console.log("$scope.relatedPrograms: ", $scope.relatedPrograms);
        });


        //it('should populate $scope.onPreviewPage to be true inside the controller when state is changed to previewProgram', function () {
        //    //set up the controller
        //    $scope = {};//$rootScope.$new();
        //    //change state
        //    changeState('previewProgram', {id: testId});
        //    expect($state.is('previewProgram')).toBe(true);
        //    //set up controller with all of its dependencies
        //    var controller = $controller('ViewProgramCtrl', {
        //        $scope: $scope,
        //        $state: $state,
        //        $stateParams: $stateParams
        //    });
        //    expect($scope.onPreviewPage).toEqual(true);
        //});


    });
});