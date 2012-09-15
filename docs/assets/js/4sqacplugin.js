var foodCategories = ["Afghan Restaurants", "African Restaurant", "American Restaurant", "Arepa Restaurant", "Argentinian Restaurant", "Asian Restaurant", "Australian Restaurant", "BBQ Joint", "Bagel Shop", "Bakery", "Brazilian Restaurant", "Breakfast Spot", "Burger Joint", "Burrito Place", "CafÃ©", "Cajun / Creole Restaurants", "Caribbean Restaurant", "Chinese Restaurant", "Coffee Shop", "Cuban Restaurant", "Cupcake Shop", "Delis / Bodegas", "Dessert Shop", "Dim Sum Restaurant", "Diner", "Distillery", "Donut Shop", "Dumpling Restaurant", "Eastern European Restaurant", "Ethiopian Restaurant", "Falafel Restaurant", "Fast Food Restaurant", "Filipino Restaurant", "Fish & Chips Shop", "Food Truck", "French Restaurant", "Fried Chicken Joint", "Gastropub", "German Restaurant", "Gluten-free Restaurant", "Greek Restaurant", "Hot Dog Joint", "Ice Cream Shop", "Indian Restaurant", "Indonesian Restaurant", "Italian Restaurant", "Japanese Restaurant", "Juice Bar", "Korean Restaurant", "Latin American Restaurant", "Mac & Cheese Joint", "Malaysian Restaurant", "Mediterranean Restaurant", "Mexican Restaurant", "Middle Eastern Restaurant", "Molecular Gastronomy Restaurant", "Mongolian Restaurant", "Moroccan Restaurant", "New American Restaurant", "Peruvian Restaurant", "Pizza Place", "Portuguese Restaurant", "Ramen / Noodle House", "Restaurant", "Salad Place", "Sandwich Place", "Scandinavian Restaurant", "Seafood Restaurant", "Snack Place", "Soup Place", "South American Restaurant", "Southern / Soul Food Restaurant", "Spanish Restaurant", "Paella Restaurant", "Steakhouse", "Sushi Restaurant", "Swiss Restaurant", "Taco Place", "Tapas Restaurant", "Tea Room", "Thai Restaurant", "Turkish Restaurant", "Vegetarian / Vegan Restaurant", "Vietnamese Restaurant", "Winery", "Wings Joint", "Bar", "Beer Garden", "Cocktail Bar", "Dive Bar", "Gay Bar", "Hookah Bar", "Hotel Bar", "Karaoke Bar", "Lounge", "Pub", "Sake Bar", "Speakeasy", "Sports Bar", "Whisky Bar"];


(function ($) {

    $.foursquareAutocomplete = function (element, options) {
        this.options = {};

        element.data('foursquareAutocomplete', this);

        this.init = function (element, options) {
            this.options = $.extend({}, $.foursquareAutocomplete.defaultOptions, options);
            this.options = $.metadata ? $.extend({}, this.options, element.metadata()) : this.options;
            updateElement(element, this.options);
        };
        this.init(element, options);
        this.select = function (event, ui) {
        };
        
    };
    $.fn.foursquareAutocomplete = function (options) {
        return this.each(function () {
            (new $.foursquareAutocomplete($(this), options));
        });
    };

    function updateElement(element, options) {
        element.autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "https://api.foursquare.com/v2/venues/suggestcompletion",
                    dataType: "jsonp",
                    data: {
                        ll: options.latitude + "," + options.longitude,
                        v: "20120214",
                        client_id: options.client_id,
                        client_secret: options.client_secret,
                        query: request.term,
                        limit: options.limit
                    },
                    success: function (data) {
                    		// Check to see if there was success
                    		if (data.meta.code != 200)
                    		{
                    			element.removeClass("ui-autocomplete-loading")
                    			options.onError(data.meta.code, data.meta.errorType, data.meta.errorDetail);
                    			return false;
                    		}
                        response($.map(data.response.minivenues, function (item) {
                          for (var i = 0 ; i < foodCategories.length ; i++ ) {
                            if (item.categories[0] != undefined && item.categories[0].name == foodCategories[i] ) {
                                  return {
                                      name: item.name,
                                      id: item.id,
                                      address: (item.location.address == undefined ? "" : item.location.address),
                                      cityLine: (item.location.city == undefined ? "" : item.location.city + ", ") + (item.location.state == undefined ? "" : item.location.state + " ") + (item.location.postalCode == undefined ? "" : item.location.postalCode),
                                      photo: (item.category == undefined ? "" : item.category.icon.prefix + "32" + item.category.icon.name), 
                                      full: item
                                  };
                            }
                          }
                          return null
                        }));
                    },
                    error: function (header, status, errorThrown) {
                    	  options.onAjaxError(header, status, errorThrown);
                    }
                });
            },
            minLength: options.minLength,
            select: function (event, ui) {
                element.val(ui.item.name);
                options.search(event, ui);
                return false;
            },
            open: function () {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },
            close: function () {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
            }
        })
            .data("autocomplete")._renderItem = function (ul, item) {
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + getAutocompleteText(item) + "</a>")
                    .appendTo(ul);
            };

    };

    $.foursquareAutocomplete.defaultOptions = {
        'latitude': 47.22,
        'longitude': -122.2,
        'oauth_token': "",
        'minLength': 3,
        'select': function (event, ui) {},
        'onError': function (errorCode, errorType, errorDetail) {},
        'onAjaxError' : function (header, status, errorThrown) {}
    };
    

    /// Builds out the <select> portion of autocomplete control
    function getAutocompleteText(item) {
        var text = "<div>";
        text += "<div class='autocomplete-name'>" + item.name + "</div>";
        if (item.address == "" && item.cityLine == "")
            text += "<div class='autocomplete-detail'>&nbsp;</div>";
        if (item.address != "")
            text += "<span class='autocomplete-detail'>" + item.address + ", " + "</span>";
        if (item.cityLine != "")
            text += "<span class='autocomplete-detail'>" + item.cityLine + "</span>";
        text += "</div>";
        return text;
    }
})(jQuery);
