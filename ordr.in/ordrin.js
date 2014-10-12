
var tatas = "24605";
var key = require('./info').key;
var ordrin = require('ordrin-api')

module.exports = function() {
    var ordrin_api = new ordrin.APIs(key, ordrin.TEST);
    ordrin_api.order_guest({
        rid: 147,
        em: 'm@cond.in',
        tray: '4622440/1,4622442+4622452/1,+4622476/1',
        tip: '5.05',
        first_name: 'Example',
        last_name: 'User',
        phone: '5046168294',
        delivery_date: 'ASAP',
        delivery_time: 'ASAP',
        addr: '1 Main Street',
        city: 'College Station',
        state: 'TX',
        zip: '77840',
        phone: '2345678901',
        card_name: 'Example User',
        card_number: '4111111111111111',
        card_cvc: '123',
        card_expiry: '02/2016',
        card_bill_addr: '1 Main Street',
        card_bill_city: 'College Station',
        card_bill_state: 'TX',
        card_bill_zip: '77840',
        card_bill_phone: '2345678901'

    }, function() {
        console.log("YAY")!
    });
}