var Element = function(selector, params)
{
	var element = $('<' + selector + '/>');

	$.each(params, function(action, value) {

		switch( action ) {
            case 'class':
            case 'clazz':
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
				element.text( value );
				break;
			case 'html':
				element.html( value );
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

String.prototype.getTranslation = function ()
{
    var key = this.toString();

    if(typeof js_translations != "undefined" && typeof js_translations[key] != "undefined")
        return js_translations[key];

    console.log(key, "is not translated");
    return "";
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function fixIePlaceholder( fields ) {
    var field,
        fieldVal = "",
        placeholderVal,
        className = 'js-input-placeholder';//see css

    fields.each(function(){
        field = $(this);
        field.val( field.attr('placeholder') ).addClass(className);
    });

    fields.on('focus', function(){
        field = $(this);
        fieldVal = field.val();
        placeholderVal = field.attr('placeholder');

        if(placeholderVal == fieldVal)
            field.val('').removeClass(className);
    }).on('blur', function(){
        field = $(this);
        fieldVal = field.val();
        placeholderVal = field.attr('placeholder');

        if(fieldVal == '')
            field.val( placeholderVal ).addClass(className);
    });
}


var Validate = {
    invalidClassName: 'invalid',
    methods: {},
    field: function (field) {
        var validationMethod = field.data('method') || field.data('type') || field.attr('type') || false,
            fieldValidated = false;

        if(!validationMethod)
            return fieldValidated;

        field.removeClass(Validate.invalidClassName).removeAttr('aria-invalid');

        if(validationMethod in this.methods && this.methods.hasOwnProperty(validationMethod))
            fieldValidated = this.methods[validationMethod](field);

        if(!fieldValidated)
            field.addClass(Validate.invalidClassName).attr('aria-invalid', true);

        return fieldValidated;
    },
    form: function ( fields ) {
        var formValidated = true,
            fieldValidated = true,
            field,
            self = this;

        fields.each(function () {

            fieldValidated = self.field( $(this) );

            formValidated = formValidated === true ? fieldValidated : false;
        });

        return formValidated;
    }
}

Validate.methods.email = function ()
{
    return validateEmail(arguments[0].val());
}

Validate.methods.numbers = function ( )
{
    var re = /^\d+$/;
    return re.test(arguments[0].val());
}



jQuery(document).ready(function($)
{
	$('body').removeClass('no-js').addClass('yes-js');


    fixIePlaceholder( $('.ie7 [placeholder], .ie8 [placeholder], .ie9 [placeholder]') );
	

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

});