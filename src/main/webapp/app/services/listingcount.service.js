(function () {
    "use strict";

    angular
        .module('app')
        .factory('ListingCount', ListingCount);

    ListingCount.$inject = ['$resource'];

    /////////////

    function ListingCount($resource) {
        return $resource('/api/listingcount', {
        }, {
            query: {
                transformResponse: function (data) {
                    var output = JSON.parse(data);

                    // Round and convert 1000 to K
                    output.new = roundConvert1000toK(output.new);
                    output.archived = roundConvert1000toK(output.archived);
                    output.updated = roundConvert1000toK(output.updated);
                    return output;
                }
            }
        })
    }

    function roundConvert1000toK(value) {
        var output = value;
        if (Number(value) >= 1000) {
            output = "" + Math.round((Number(value))/1000) + "K";
        }
        return output;
    }
})();
