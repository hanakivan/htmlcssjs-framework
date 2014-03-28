var Element = function(selector, params)
{
	var element = $('<' + selector + '/>');

	$.each(params, function(action, value) {

		switch( action ) {
			case 'class':
				element.addClass(value);
				break;
			case 'className':
				element.addClass(value);
				break;
			case 'selected':
				element.prop('selected', true);
				break;
			case 'checked':
				element.prop('checked', true);
				break;
			case 'text':
				element.text( value )
				break;
			case 'html':
				element.html( value )
				break;
			case  'id':
				element.attr('id', value);
				break;
			case  'hide':
				element.hide();
				break;
			default:
				element.attr(action, value);
				break;
		}
	});
	return element;
}

var T = {
    get: function(translation) {
        return this.getInLang(translation, lang);
    },
    getInLang: function(translation, from_lang) {
        var translated_string = js_translations[from_lang][translation];

        if(typeof translated_string !== 'undefined')
            return translated_string;

        return "";
    }
}

jQuery(document).ready(function($)
{
	$('body').removeClass('no-js').addClass('yes-js');

	$('.js-show').show();

    fixIePlaceholder();
	

	/*var Dialog = function( )
	{
		var self = this;

		self.content = arguments[0] || false;
		self.id = arguments[1] || 'dialog';
		self.hasOverlay = arguments[2] || false;

		self.open = function()
		{
			self.build();

			if(self.hasOverlay)
			{
				self.getOverlayNode().fadeIn("fast", function(){
					self.getDialogNode().fadeIn();
				});
			}
			else
			{
				self.getDialogNode().fadeIn();
			}

			self.events();
		}

		self.close = function()
		{
			if(self.hasOverlay)
			{
				self.getDialogNode().fadeOut("fast", function(){
					self.getOverlayNode().fadeOut("fast", function(){
						self.destroy();
					});
				});
			}
			else
			{
				self.getDialogNode().fadeOut("fast", function(){
					self.destroy();
				});
			}
		}

		self.build = function()
		{
			if(!self.content)
				return;

			var documentBody = $('body');

			//documentBody.append( Element.new('div', {id: self.id, html: self.content, hide: true}) );
			documentBody.append( new Element('div', {id: self.id, html: self.content, hide: true}) );

			if(self.hasOverlay)
				//documentBody.append( Element.new('div', {id: self.getOverlayNodeId(), hide: true}) );
				documentBody.append( new Element('div', {id: self.getOverlayNodeId(), hide: true}) );

		}

		self.destroy = function()
		{
			self.destroyOverlay();
			self.destroyDialog();
		}

		self.destroyOverlay = function()
		{
			if(self.hasOverlay)
				self.getOverlayNode().remove();
		}

		self.destroyDialog = function()
		{
			self.getDialogNode().remove();
		}

		self.getOverlayNodeId = function()
		{
			if(self.hasOverlay)
				return self.id + '-overlay';
			return "";
		}

		self.getOverlayNode = function()
		{
			if(self.hasOverlay)
				return $('#' + self.getOverlayNodeId());
			return false;
		}

		self.getDialogNode = function()
		{
			return $('#' + self.id);
		}

		self.events = function()
		{
			$('#' + self.id + ' [data-action="close"]').on('click', function(){
				self.close();
			});
		}

		self.open();
	}*/

    //should be in a jquery scope
    function fixIePlaceholder() {
        var fields = arguments[0] || $('.ie7 [placeholder], .ie8 [placeholder], .ie9 [placeholder]'),
            field,
            fieldVal = "",
            placeholderVal;

        fields.each(function(){
            field = $(this);
            placeholderVal = field.attr('placeholder');

            field.val( placeholderVal );
        });

        fields.on('focus', function(){
            field = $(this);
            fieldVal = field.val();
            placeholderVal = field.attr('placeholder');

            if(placeholderVal == fieldVal)
                field.val('');
        }).on('blur', function(){
            field = $(this);
            fieldVal = field.val();
            placeholderVal = field.attr('placeholder');

            if(fieldVal == '')
                field.val( placeholderVal );
        });
    }
});