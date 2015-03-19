var app = app || {};

app.ProductsView = (function($) {

	'use strict';

	return Backbone.View.extend({
		
		tagName: 'div',
		
		template: _.template($('.js-Compare-Template').html()),

		render: function(){
			return this.template(this.collection.getCompared());
		}
	});

})(jQuery);
