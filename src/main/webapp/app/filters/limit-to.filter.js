!function() {
    //Exact limitTo filter found in Angular 1.4+. Remove once upgraded from 1.2.
    angular.module('app')
        .filter('limitToCFDA', limitToFilter)

    ////////////

    function limitToFilter() {
        return function(input, limit, begin) {
			if (Math.abs(Number(limit)) === Infinity) {
			  limit = Number(limit);
			} else {
			  limit = toInt(limit);
			}
			if (isNaN(limit)) return input;

			if (angular.isNumber(input)) input = input.toString();
			if (!angular.isArray(input) && !angular.isString(input)) return input;

			begin = (!begin || isNaN(begin)) ? 0 : toInt(begin);
			begin = (begin < 0) ? Math.max(0, input.length + begin) : begin;

			if (limit >= 0) {
			  return input.slice(begin, begin + limit);
			} else {
			  if (begin === 0) {
				return input.slice(limit, input.length);
			  } else {
				return input.slice(Math.max(0, begin + limit), begin);
			  }
			}
        };
		
		///////////
		
		function toInt(str) {
		  return parseInt(str, 10);
		}
    }
}();