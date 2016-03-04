'use strict';

describe("Unit Tests for the uxHierarchyDropdown directive", function() {
    var $compile,
        $rootScope,
        $timeout,
        t_counter,
        tree;

    beforeEach(module("templates"));
    beforeEach(module("app"));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    beforeEach(function(){
        t_counter = 0;
        tree = $rootScope.tree = createTree();
    });

    function TreeNode(name) {
        var self = this;

        self.name = name;
        self.id = ++t_counter;
        self.value = self.id + "-" + self.name + " (val)";
        var _children = [];
        self.add = add;

        Object.defineProperty(self, 'children', {
            enumerable: true,
            get: function() {
                return _children.slice();
            }
        });

        /////////////

        function add(node) {
            _children.push(node);
        }
    }

    function createTree() {
        var a = new TreeNode("A");
        var b = new TreeNode("B");
        var c = new TreeNode("C");

        var aa = new TreeNode("AA");
        var ab = new TreeNode("AB");
        var ac = new TreeNode("AC");
        var ad = new TreeNode("AD");

        a.add(aa);
        a.add(ab);
        a.add(ac);
        a.add(ad);

        var aaa = new TreeNode("AAA");
        var aab = new TreeNode("AAB");

        aa.add(aaa);
        aa.add(aab);

        var aba = new TreeNode("ABA");
        var abb = new TreeNode("ABA");

        ab.add(aba);
        ab.add(abb);

        var ba = new TreeNode("BA");
        var bb = new TreeNode("BB");
        var bc = new TreeNode("BC");
        var bd = new TreeNode("BD");

        b.add(ba);
        b.add(bb);
        b.add(bc);
        b.add(bd);

        var baa = new TreeNode("BAA");
        var bab = new TreeNode("BAB");

        ba.add(baa);
        ba.add(bab);

        var bba = new TreeNode("BBA");
        var bbb = new TreeNode("BBB");

        bb.add(bba);
        bb.add(bbb);

        var ca = new TreeNode("CA");
        var cb = new TreeNode("CB");
        var cc = new TreeNode("CC");
        var cd = new TreeNode("CD");

        c.add(ca);
        c.add(cb);
        c.add(cc);
        c.add(cd);

        var caa = new TreeNode("CAA");
        var cab = new TreeNode("CAB");

        ca.add(caa);
        ca.add(cab);

        var cba = new TreeNode("CBA");
        var cbb = new TreeNode("CBA");

        cb.add(cba);
        cb.add(cbb);

        return [a, b, c];
    }

    function createElement(attr) {
        var element = angular.element(''+
            '<form name="form">' +
            '<ux-hierarchy-dropdown ' +
            'ng-model="value" ' +
            'ux-tree="tree" ' +
            'ux-branch-x="node.id as node.name for node in uxTree with children node.children track by node.id has label \'test\'" ' +
            '></ux-hierarchy-dropdown>' +
            '</form>');
        var uxHierarchyDropdown = element.find('ux-hierarchy-dropdown');
        if(attr)
            uxHierarchyDropdown.attr(attr);
        $compile(element)($rootScope);
        return uxHierarchyDropdown;
    }

    function getSelectElement(element, index) {
        return angular.element(element.find('select')[index]);
    }

    describe("Tests for common entry", function() {
        it('should have a single select at the start (empty model value)', function(){
            var element = createElement();

            expect(element.find('select').length).toBe(1)
        });

        it('should update selects and model when a selection is made', function() {
            var element = createElement(),
                firstNode = tree[0],
                secondNode = firstNode.children[0],
                thirdNode = secondNode.children[0],
                isoScope = element.find('div').scope();
            $rootScope.$digest();

            isoScope._branchSelections[0] = firstNode;
            $rootScope.$digest();
            expect(element.find('select').length).toBe(2);
            expect(getSelectElement(element, 0).val()).toEqual(firstNode.id.toString());
            expect(getSelectElement(element, 1).val()).toEqual('');

            isoScope._branchSelections[1] = secondNode;

            $rootScope.$digest();
            expect(element.find('select').length).toBe(3);
            expect(getSelectElement(element, 0).val()).toEqual(firstNode.id.toString());
            expect(getSelectElement(element, 1).val()).toEqual(secondNode.id.toString());
            expect(getSelectElement(element, 2).val()).toEqual('');

            isoScope._branchSelections[2] = thirdNode;

            $rootScope.$digest();
            expect(element.find('select').length).toBe(3);
            expect(getSelectElement(element, 0).val()).toEqual(firstNode.id.toString());
            expect(getSelectElement(element, 1).val()).toEqual(secondNode.id.toString());
            expect(getSelectElement(element, 2).val()).toEqual(thirdNode.id.toString());
            expect($rootScope.value).toEqual(thirdNode.id);

            isoScope._branchSelections[0] = tree[1];
            $rootScope.$digest();
            expect(element.find('select').length).toBe(2);
            expect(getSelectElement(element, 0).val()).toEqual(tree[1].id.toString());
            expect(getSelectElement(element, 1).val()).toEqual('');
            expect($rootScope.value).toEqual(undefined);
        });

        it('should have the ability to specifiy specific branch configurations', function() {
            var element = createElement({
                    'ux-branch-2': "has label 'test 20'",
                    'ux-branch-3': "node.value as node.id for node with children node.children track by node.value has label 'test 30'"
                }),
                firstNode = tree[0],
                secondNode = firstNode.children[0],
                thirdNode = secondNode.children[0],
                isoScope = element.find('div').scope();
            $rootScope.$digest();

            isoScope._branchSelections[0] = firstNode;
            $rootScope.$digest();
            expect(element.find('select').length).toBe(2);
            expect(getSelectElement(element, 0).val()).toEqual(firstNode.id.toString());
            expect(getSelectElement(element, 1).val()).toEqual('');
            expect(getSelectElement(element, 1).parent().find('label').text()).toEqual('test 20');

            isoScope._branchSelections[1] = secondNode;

            $rootScope.$digest();
            expect(element.find('select').length).toBe(3);
            expect(getSelectElement(element, 0).val()).toEqual(firstNode.id.toString());
            expect(getSelectElement(element, 1).val()).toEqual(secondNode.id.toString());
            expect(getSelectElement(element, 1).parent().find('label').text()).toEqual('test 20');
            expect(getSelectElement(element, 2).val()).toEqual('');
            expect(getSelectElement(element, 2).parent().find('label').text()).toEqual('test 30');

            isoScope._branchSelections[2] = thirdNode;

            $rootScope.$digest();
            expect(element.find('select').length).toBe(3);
            expect(getSelectElement(element, 0).val()).toEqual(firstNode.id.toString());
            expect(getSelectElement(element, 1).val()).toEqual(secondNode.id.toString());
            expect(getSelectElement(element, 2).val()).toEqual(thirdNode.value.toString());
            expect($rootScope.value).toEqual(thirdNode.value);

        });

        it('should have an X amount of select elements at the start in branch order (defined model value)', function(){
            var nodeId = tree[0].children[1].children[1].id;
            $rootScope.value = nodeId;
            var element = createElement();
            $rootScope.$digest();
            var selectElements = element.find('select');
            expect(selectElements.length).toBe(3);
            expect($rootScope.value).toBe(nodeId);
            expect(angular.element(selectElements[0]).val()).toEqual(tree[0].id.toString());
            expect(angular.element(selectElements[1]).val()).toEqual(tree[0].children[1].id.toString());
            expect(angular.element(selectElements[2]).val()).toEqual(nodeId.toString());
        });

        it('should translate array values into a single value (takes first element of array)', function(){
            var nodeId = [tree[0].children[1].children[1].id];
            $rootScope.value = nodeId;
            var element = createElement();
            $rootScope.$digest();
            var selectElements = element.find('select');
            expect(selectElements.length).toBe(3);
            expect($rootScope.value).toBe(nodeId[0]);
            expect(angular.element(selectElements[0]).val()).toEqual(tree[0].id.toString());
            expect(angular.element(selectElements[1]).val()).toEqual(tree[0].children[1].id.toString());
            expect(angular.element(selectElements[2]).val()).toEqual(nodeId[0].toString());
        });
    });

    describe("Tests for multi-entry",function() {
        it("should have 'Selected' label and the 'ul' element at the start (empty model value)", function(){
            var element = createElement({
                'ux-multiple': ''
            });
            expect(element.attr('ux-multiple')).toBeDefined();
            expect(element.find('ul').length).toBe(1);

            var labelElement = element.find('p');
            expect(labelElement.length).toBe(1);
            expect(labelElement.text()).toEqual('Selected');
        });
    });
});