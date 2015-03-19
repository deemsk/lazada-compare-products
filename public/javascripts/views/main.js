var app = app || {};

app.MainView = (function($) {
    
    'use strict';

    return Backbone.View.extend({
    	el: 'body',
    	
    	events: {
    	    'submit .js-Compare-Form': 'onFormSubmit',
    	    'click .js-Compare-Form-Get-Examples': 'fillFieldsExamples',
    	    'click .js-Compare-Form-Clear': 'clearForm'
    	},

    	initialize: function() {
    	    this.$urls = $('.js-Compare-Form-Url');
    	    this.$fields = this.$urls.add('.js-Compare-Form-Submit');
    	    this.$error = $('.js-Compare-Form-Error');
    	    this.$container = $('.js-Compare-Products-Container')
    	    
    	    this.productsView = new app.ProductsView({
    	        collection: app.products
    	    });

    	    this.listenTo(app.products, 'request', this.startLoading);
    	    this.listenTo(app.products, 'sync', this.stopLoading);
    	    this.listenTo(app.products, 'sync', this.renderProducts);
    	},
    	
    	onFormSubmit: function(event) {
    	    event.preventDefault();
    	    if (this.validate()) {
    	        this.loadProducts();
    	    }
    	},

    	validate: function() {
    	    var rAllowableUrl = /https?:\/\/(www\.)?lazada\.vn\/.*\.html/,
    	        isValid = true;

            this.$urls.each(function(index, input) {
                var $input = $(input),
                    isValueValid = rAllowableUrl.test($.trim($input.val()));
                
                $input.toggleClass('form-control_error', !isValueValid);
                if (!isValueValid) isValid = false;
            });

            this.showError('Please enter a valid url', !isValid);

            return isValid;
    	},
    	
    	resetValidation: function() {
    	    this.$urls.removeClass('form-control_error');
    	    this.showError('', false);
    	},
    	
    	showError: function(msg, state) {
    		this.$error.text(msg).toggleClass('hidden', !state);
    	},

    	loadProducts: function() {
            app.products.fetch({
                data: $.param({
                    url: this.$urls.get().map(function(input) {
                        return input.value.trim();
                    })
                }, true)
            });
    	},
    	
    	startLoading: function() {
    	    this.$fields.prop('disabled', true);
    	    this.$container
    	        .empty()
    	        .removeClass('hidden')
    	        .addClass('compare_loading');
    	},

    	stopLoading: function() {
    	    this.$fields.prop('disabled', false);
    	    this.$container.removeClass('compare_loading');
    	},

    	fillFieldsExamples: function() {
    	    this.resetValidation();
    	    this.$urls.first().val('http://www.lazada.vn/apple-iphone-6-16gb-xam-hang-nhap-khau-240697.html');
    	    this.$urls.last().val('http://www.lazada.vn/alcatel-ot-idol-6030d-16gb-xam-235577.html');
    	},

    	clearForm: function() {
    	    this.resetValidation();
    	    this.$urls.val('').first().focus();
    	},

    	renderProducts: function() {
    	    this.$container.html(this.productsView.render());
    	}
    })

})(jQuery);