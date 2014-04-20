String.prototype.replaceAll = function (sfind, sreplace) {
    var str = this;
    while (str.indexOf(sfind)>-1) str=str.replace(sfind, sreplace);
    return str;
};

String.prototype.parseObj = function (keys, dataObj) {

    var template = this,
        key;

    if(keys.length < 1)
        return "";

    for(var i = 0, l = keys.length; i < l; i++)
    {
        key = keys[i];

        if(key in dataObj && dataObj.hasOwnProperty(key))
            template = template.replaceAll('%'+key+'%', dataObj[key]);
    }

    return template;
};

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
    methods: {
        email: function () {
            return validateEmail(arguments[0].val());
        }
    },
    field: function (field) {
        var validationMethod = field.data('method') || field.data('type') || field.attr('type') || field.prop('tagName') || false,
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
};

function Loop(wrapIdAttr, itemClassName, useBullets) {
    var self = this;

    self.$current = null;
    self.$next = null;

    self.length = self.helpers.getItems().length;
    self.timeout = null;

    self.hidePromise = null;
    self.showPromise = null;

    //abstract methods
    self.attachEventListenersInternal = function () {};
    self.detachEventListenersInternal = function () {};
    self.animationShowInternal = function () {};
    self.animationHideInternal = function () {};

    self.moveLeftwards = function ()
    {

    };

    self.moveRightwards = function ()
    {

    };

    self.moveToFirst = function ()
    {

    };

    self.moveToLast = function ()
    {

    };

    self.animation = function ()
    {

    };

    self.animationShow = function ()
    {
        self.animationShowInternal();
    };

    self.animationHide = function ()
    {
        self.animationHideInternal();
    };

    self.startInterval = function ()
    {
        self.stopInterval();
    };

    self.stopInterval = function ()
    {
        try {
            clearTimeout(self.timeout);
        }
        finally {}
    };

    self.attachEventListeners = function ()
    {
        $(document).on('keyup', self.moveOnKeyPress);
        self.helpers.getWrap().on('mouseenter', self.stopInterval);
        self.helpers.getWrap().on('mouseleave', self.startInterval);

        self.attachEventListenersInternal();
    };

    //is it ever going to be used?
    self.detachEventListeners = function ()
    {
        $(document).off('keyup', self.moveOnKeyPress);
        self.helpers.getWrap().off('mouseenter', self.stopInterval);
        self.helpers.getWrap().off('mouseleave', self.startInterval);

        self.detachEventListenersInternal();
    };

    self.moveOnKeyPress = function (e)
    {
        switch(e.keyCode) {
            case 35://end key
                self.moveToLast();
                break;
            case 36://home key
                self.moveToFirst();
                break;
            case 37://left key
                self.moveLeftwards();
                break;
            case 39://right key
                self.moveRightwards();
                break;
        }
    };

    self.init = function ()
    {
        self.startInterval();
    };


    self.helpers = {
        getWrap: function () {
            return $('#'+wrapIdAttr);
        },
        getItems: function () {
            return self.helpers.getWrap().find('.'+itemClassName);
        }
    }
}

function NewsSlider() {}
NewsSlider.prototype = new Loop('news-slider', 'news-slider-article', true);
NewsSlider.animationShowInternal = function ()
{
    this.hidePromise = this.$current.hide({effect: 'fold', duration: 800, easing: 'easeOutQuad'});
};
NewsSlider.animationHideInternal = function ()
{
    this.showPromise = this.$next.fadeIn();
};
var newsSlider = new NewsSlider();
newsSlider.init();

function Dialog( modalId, hasOverlay, dataObj ) {

    var self = this;

    //node holders
    self.modal = null;
    self.overlay = null;

    //abstract methods
    self.internalOpen = function () {};
    self.internalClose = function () {};
    self.attachEventListenersInternal = function () {};
    self.detachEventListenersInternal = function () {};

    //thou shalt call it to display modal
    self.open = function ()
    {
    	self.reloadInternal();

        self.build();
        self.attachEventListeners();
        self.internalOpen();
    };

    //you can oerride it if you want
    self.reloadInternal = function ()
    {
        if(self.helpers.isBuiltModal()) {
            self.helpers.getModal().remove();
        }

        if(hasOverlay && self.helpers.isBuiltOverlay()) {
        	self.helpers.getOverlay().remove();
        }
    };


    //though shalt call it when hiding modal
    self.close = function ()
    {
        self.internalClose();
        self.destroy();
    };

    self.build = function ()
    {
        var template = self.helpers.getTemplate();

        if(typeof dataObj != "undefined" && !$.isEmptyObject(dataObj))
            template = template.parseObj(dataObj);

        $(window.document.body).append(template);
        self.modal = self.helpers.getModal();
        self.modal.hide();

        if(hasOverlay)
            self.buildOverlay();
    };

    self.buildOverlay = function ()
    {
        $(window.document.body).append(self.helpers.getOverlayTemplate() );
        self.overlay = self.helpers.getOverlay();
        self.overlay.hide();
    };

    self.destroy = function ()
    {
        self.detachEventListeners();

        self.modal.remove();

        if(hasOverlay)
            self.destroyOverlay();
    };

    self.destroyOverlay = function ()
    {
        self.overlay.remove();
    };

    self.attachEventListeners = function ()
    {
        $(document).on('keyup', self.hideOnEscKeyPress);

        self.helpers.getModal().find('[data-action="close-modal"]').on('click', self.close);

        if(hasOverlay)
            self.helpers.getOverlay().on('click', self.close);

        self.attachEventListenersInternal();
    };

    self.detachEventListeners = function ()
    {
        $(document).off('keyup', self.hideOnEscKeyPress);

        self.helpers.getModal().find('[data-action="close-modal"]').off('click', self.close);

        if(hasOverlay)
            self.helpers.getOverlay().off('click', self.close);

        self.detachEventListenersInternal();
    };

    self.hideOnEscKeyPress = function (e)
    {
        e.stopPropagation();
        if(e.keyCode == 27)
            self.close();
    };

    self.helpers = {
        getModal: function () {
            return $('#modal-dialog-'+modalId);
        },
        getOverlay: function () {
            return $('#modal-overlay-'+modalId);
        },
        getTemplate: function () {
            var template = $('#modal-dialog-template-'+modalId);

            if(!template.length)
                return '<div id="modal-dialog-'+modalId+'">dialog</div>';
            return template.html();
        },
        getOverlayTemplate: function () {
            var template = $('#modal-overlay-template-'+modalId);

            if(!template.length)
                return '<div id="modal-overlay-'+modalId+'">overlay</div>';
            return template.html();
        },
        isBuiltModal: function () {
        	return self.helpers.getModal().length > 0;
        },
        isBuiltOverlay: function () {
        	return self.helpers.getOverlay().length > 0;
        }
    }
}

function Login() {}
Login.prototype = new Dialog('ivan', true);
Login.prototype.internalOpen = function ()
{
    this.overlay.show();
    this.modal.show();
};
var l = new Login();
l.open();

function ieHTML5() {
    if(document.documentElement.className.indexOf('ie') !== -1)
    {
        document.createElement("main");
        document.createElement("header");
        document.createElement("footer");
        document.createElement("section");
        document.createElement("article");
        document.createElement("nav");
        document.createElement("aside");
        document.createElement("menu");
        document.createElement("figcaption");
        document.createElement("figure");
        document.createElement("time");
    }
}



jQuery(document).ready(function($)
{
	$('body').removeClass('no-js').addClass('yes-js');

    ieHTML5();

    fixIePlaceholder( $('.ie7 [placeholder], .ie8 [placeholder], .ie9 [placeholder]') );
});