describe('Unit Tests for Filter: intersect', function() {
  var leftStringArr,
      rightStringArr,
      leftNumberArr,
      rightNumberArr,
      intersect;

  beforeEach(function(){
    module('app');
    inject(function(_$filter_) {
      leftStringArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      rightStringArr = ['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
      leftNumberArr = [1, 2, 3, 4 ,5, 6, 7, 8, 9];
      rightNumberArr = [5, 6, 7, 8, 9, 10, 11, 12, 13];
      intersect = _$filter_('intersect');
    });
  });


  it('should return the intersect of the left and right arrays', function() {
    expect(intersect(leftStringArr, rightStringArr)).toEqual(['e', 'f', 'g', 'h']);
    expect(intersect(leftNumberArr, rightNumberArr)).toEqual([5, 6, 7, 8, 9]);
  });

  it('should return an empty array if the left and right arrays do not have matching elements', function() {
    expect(intersect(leftStringArr, rightNumberArr)).toEqual([]);
  });

  it('should return an empty array if an array is not passed in', function() {
    expect(intersect(null, null)).toEqual([]);
    expect(intersect(undefined, undefined)).toEqual([]);
    expect(intersect(1, 2)).toEqual([]);
  });
});