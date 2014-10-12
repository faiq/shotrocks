/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
// var Vector2 = require('vector2');

setInterval(function() {
    console.log("test...");
}, 1000);

// if isLoggedIn is set, do nothing, else, set to false
var isLoggedIn = Settings.data('isLoggedIn');
if (isLoggedIn === null || isLoggedIn === undefined) {
    isLoggedIn = false;
    Settings.data('isLoggedIn', false);

}

function drinkAlert(title, text) {
    Pebble.showSimpleNotificationOnPebble(title, text);
}

var loadingCard = new UI.Card();
loadingCard.title('Loading Drinks...');
loadingCard.show();

var notify = function(title, subtitle, body) {
    var card = new UI.Card();
    card.title(title);
    card.subtitle(subtitle);
    card.body(body);
    card.show();
    return card;
};

ajax({
    url: 'http://matt.cond.in/hackru/drinks.json',
    type: 'json'
}, function(data) {

    var main = new UI.Menu({
        sections: data
    });

    main.show();
    loadingCard.hide();

    main.on('select', function(e) {
        var recentDrinks = Settings.data('drinks') || [];
        recentDrinks.push(e.item.title);
        Settings.data('drinks', recentDrinks);
        console.log(recentDrinks);

        var card = notify('Logging Drink', e.item.title, e.item.subtitle);
        main.hide();
        // @TODO(Shrugs) make this actually programatically close window instead of crashing app
        ajax({
            url: 'http://google.com',
            method: 'POST',
            data: {
                drinkId: e.item.title,
                userId: Settings.data('userId')
            }
        }, function() {
            card.hide();
            setTimeout(function() {
                drinkAlert("yo", "yo");

            }, 2000);
        }, function() {
            card.hide();
        })
        
    });

}, function(err) {
    // whelp, just give up, I guess
    notify('Failed to load drinks.', 'I don\'t even know, dude.');
    console.log('whelp.' + err);
});


Settings.config({
    url: isLoggedIn ? 'http://google.com/' : 'http://bing.com'
}, function(e) {
    //open
    console.log('open');
}, function(e) {
    // close
    console.log(JSON.stringify(e.options));
    Settings.data('userId', e.options.id);
    Settings.data('isLoggedIn', true);
});