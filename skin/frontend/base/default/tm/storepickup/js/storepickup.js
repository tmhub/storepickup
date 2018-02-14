var FC = FC || {};
FC.Storepickup = {
    init: function () {
        $('billing:use_for_shipping_yes').up('li').insert({
            after: [
                '<li class="control tm_storepickup" style="margin-top:-1px;">',
                    '<input type="radio" id="tm_storepickup" name="billing[use_for_shipping]" value="tm_storepickup" class="radio"/>',
                    '<label for="tm_storepickup">' + Translator.translate('Pickup at store') + '</label>',
                '</li>'
            ].join('')
        });

        var self = this;
        $('tm_storepickup').observe('click', function () {
            checkout.update(checkout.urls.shipping_address);
        });

        if (shippingMethod.getCurrentMethod() === this.method) {
            this.enable();
        } else {
            this.disable();
        }
    },

    enable: function () {
        $('shipping-address').hide();

        // this radio doesn't sync with server
        $('tm_storepickup').checked = true;

        // force method activation
        var el = $$('input[value=' + this.method + ']').first();
        if (!el.checked) {
            el.checked = true;
            FC.Utils.fireEvent(el, 'click');
        }

        // hide all other methods
        this.togglePickupMethodVisibility(true);
    },

    disable: function () {
        var self = this;

        this.togglePickupMethodVisibility(false);
        if ($$('[name="shipping_method"]').length > 2) {
            var el = $$('input[value=' + this.method + ']').first();
            if (el.checked) {
                shippingMethod.reset();
            }
        } else {
            $$('[name="shipping_method"]').each(function (radio) {
                if (radio.value === self.method) {
                    return;
                }
                if (!radio.checked) {
                    radio.checked = true;
                    FC.Utils.fireEvent(radio, 'click');
                }
                throw $break;
            });
        }
    },

    sync: function () {
        if ($('tm_storepickup').checked) {
            this.enable();
        } else {
            this.disable();
        }
    },

    togglePickupMethodVisibility: function (flag) {
        var self = this;

        // hide/show all methods
        var method = flag ? 'hide' : 'show';
        $$('#shipping-method .sp-methods dt, #shipping-method .sp-methods dd').invoke(method);

        // show/hide pickup method
        var radio = $$('input[value=' + this.method + ']').first(),
            method = flag ? 'show' : 'hide',
            dd = radio.up('dd'),
            dt = dd.previous('dt');

        dd[method]();
        dt[method]();
    }
};

document.observe('dom:loaded', function () {
    FC.Storepickup.init();
});

document.observe('firecheckout:setResponseAfter', function (e) {
    if (!e.memo.response.update_section ||
        !e.memo.response.update_section['shipping-method']) {

        return;
    }

    FC.Storepickup.sync();
});
