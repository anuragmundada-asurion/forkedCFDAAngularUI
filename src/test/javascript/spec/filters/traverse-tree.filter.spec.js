'use strict';

describe("Unit Tests for the traverseTree filter", function() {
    var $filter,
        $parse,
        t_counter,
        traverseTreeFilter,
        tree;

    beforeEach(inject(function(_$filter_, _$parse_){
        $filter = _$filter_;
        $parse = _$parse_;
        traverseTreeFilter = $filter("traverseTree");
    }));

    beforeEach(function(){
        t_counter = 0;
        tree = createTree();
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

    it('should find an item in a tree structure', function(){
        var nodeC = tree[2],
            nodeBA = tree[1].children[0],
            nodeAAB = tree[0].children[0].children[1],
            searchKeys = [nodeBA.id, nodeAAB.id, nodeC.id],
            config = {
                branches: {
                    X: {
                        keyProperty: $parse('id'),
                        childrenProperty: $parse('children')
                    }
                }
            };

        var foundNodes = traverseTreeFilter(searchKeys, tree, config);

        expect(foundNodes.length).toBe(searchKeys.length);
        var foundNodesOriginals = [];
        foundNodes.forEach(function(foundNode){
            expect(foundNode.$key).toBeDefined();
            expect(foundNode.$level).toBeDefined();
            expect(foundNode.$original).toBeDefined();
            foundNodesOriginals.push(foundNode.$original);
        });
        expect(foundNodesOriginals).toContain(nodeBA);
        expect(foundNodesOriginals).toContain(nodeAAB);
        expect(foundNodesOriginals).toContain(nodeC);
    });

    it('should utlize specific branch configurations if defined', function(){
        var nodeC = tree[2],
            nodeBA = tree[1].children[0],
            nodeAAB = tree[0].children[0].children[1],
            nodeAABA = new TreeNode("AABA");
        nodeAAB.likes = [nodeAABA];

        var searchKeys = [nodeBA.value, nodeAAB.id, nodeC.id, nodeAABA.id],
            config = {
                branches: {
                    X: {
                        keyProperty: $parse('id'),
                        childrenProperty: $parse('children')
                    },
                    2: {
                        keyProperty: $parse('value')
                    },
                    3: {
                        childrenProperty: $parse('likes')
                    }
                }
            };
        var foundNodes = traverseTreeFilter(searchKeys, tree, config);

        expect(foundNodes.length).toBe(searchKeys.length);

        var foundNodesOriginals = [];
        foundNodes.forEach(function(foundNode){
            expect(foundNode.$key).toBeDefined();
            expect(foundNode.$level).toBeDefined();
            expect(foundNode.$original).toBeDefined();
            foundNodesOriginals.push(foundNode.$original);
        });
        expect(foundNodesOriginals).toContain(nodeBA);
        expect(foundNodesOriginals).toContain(nodeAAB);
        expect(foundNodesOriginals).toContain(nodeC);
        expect(foundNodesOriginals).toContain(nodeAABA);
    });

    it("should find the node and include the parent nodes if 'includeParent' is true in config", function(){
        var nodeAAB = tree[0].children[0].children[1],
            searchKeys = [nodeAAB.id],
            config = {
                branches: {
                    X: {
                        keyProperty: $parse('id'),
                        childrenProperty: $parse('children')
                    }
                },
                includeParent: true
            };

        var foundNodes = traverseTreeFilter(searchKeys, tree, config);

        expect(foundNodes.length).toBe(searchKeys.length);
        var foundNodesOriginals = [];
        foundNodes.forEach(function(foundNode){
            expect(foundNode.$key).toBeDefined();
            expect(foundNode.$level).toBeDefined();
            expect(foundNode.$original).toBeDefined();
            expect(foundNode.$parent).toBeDefined();
            foundNodesOriginals.push(foundNode.$original);
        });
        expect(foundNodesOriginals).toContain(nodeAAB);
        var parentCount = 0,
            parent = foundNodes[0].$parent;
        while(parent) {
            parentCount++;
            expect(parent.$level).toBeDefined();
            if(parent.$level !== 1)
                expect(parent.$parent).toBeDefined();
            expect(parent.$key).toBeDefined();
            expect(parent.$original).toBeDefined();
            parent = parent.$parent;
        }
        expect(parentCount).toBe(2);
    });

    it('should return an empty array if passed array is not an array', function() {
        expect(traverseTreeFilter(null, tree, {})).toEqual([]);
        expect(traverseTreeFilter(undefined, tree, {})).toEqual([]);
        expect(traverseTreeFilter(2, tree, {})).toEqual([]);
        expect(traverseTreeFilter('test', tree, {})).toEqual([]);
    });
    it('should return an empty array if tree array is not an array', function() {
        expect(traverseTreeFilter([14, 15], null, {})).toEqual([]);
        expect(traverseTreeFilter([14, 15], undefined, {})).toEqual([]);
        expect(traverseTreeFilter([14, 15], 2, {})).toEqual([]);
        expect(traverseTreeFilter([14, 15], 'test', {})).toEqual([]);
    });
    it('should return an empty array if config is not an object', function() {
        expect(traverseTreeFilter([14, 15], tree, null)).toEqual([]);
        expect(traverseTreeFilter([14, 15], tree, undefined)).toEqual([]);
        expect(traverseTreeFilter([14, 15], tree, 2)).toEqual([]);
        expect(traverseTreeFilter([14, 15], tree, 'test')).toEqual([]);
    });
});