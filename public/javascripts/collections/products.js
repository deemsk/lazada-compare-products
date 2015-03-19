var app = app || {};

app.Products = (function() {

    'use strict';

	return Backbone.Collection.extend({
	
        model: app.Product,

        url: '/shards/products',

        getCompared: function() {
    		var products = this.toJSON();
			var result = {};

			function getValues(name) {
			    return _.map(products, function(item) {
			        return item[name];
			    });
			}

			if (_.every(products, function(product) {
			    return product.specs;
			})) {
    			_.extend(result, {
                    specs: _.union.apply(_, _.map(products, function(product) {
                        return _.keys(product.specs);
                    })).map(function(key) {
                        return {
                        	name: key,
                        	values: _.map(products, function(product) {
                        	    return product.specs[key]
                        	})
                        }
                    })
        		});
        	}

			_.each(products[0], function(product, key) {
    			if (key !== 'specs') result[key] = getValues(key);
        	});

            return result;
        }
    });

})();
