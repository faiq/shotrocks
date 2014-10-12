/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

 var mainURL = 'http://104.131.103.149:5000';

var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
var Vibe = require('ui/vibe');
// var Vector2 = require('vector2');


// if isLoggedIn is set, do nothing, else, set to false
var isLoggedIn = Settings.data('isLoggedIn');
if (isLoggedIn === null || isLoggedIn === undefined) {
    isLoggedIn = false;
    Settings.data('isLoggedIn', false);

}

var FEMALE_WATER_WEIGHT = 0.49;
var FEMALE_METABOLISM = 0.017;
var MALE_WATER_WEIGHT = 0.58;
var MALE_METABOLISM = 0.015;

var LBS_TO_KG = 0.453592;

function BACAt(drinks, t, gender, weight) {
    // function of time (in decimal hours) that returns BAC level based on drinks in database
    // via http://en.wikipedia.org/wiki/Blood_alcohol_content
    console.log(drinks, (t/1000)/3600, gender, weight);
    var bac = ((0.806 * drinks * 1.2) / ((gender?MALE_WATER_WEIGHT:FEMALE_WATER_WEIGHT) * weight*LBS_TO_KG)) -
        ((gender?MALE_METABOLISM:FEMALE_METABOLISM) * (t/1000)/3600);

    bac = bac < 0 ? 0 : bac;
    return bac;
}

function tForBAC(bac) {

    // lose 0.015 BAC per hour
    var hours = bac/0.015;
    return hours;

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

// ajax({
//     url: 'http://matt.cond.in/hackru/drinks.json',
//     type: 'json'
// }, function(data) {

    var data = [
    {
        "title": "Beers",
        "items": [
            {
                "title": "Normal Beer",
                "subtitle": 5
            },
            {
                "title": "Heavy Beer",
                "subtitle": 9
            }
        ]
    },
    {
        "title": "Hard Liquors",
        "items": [
            {
                "title": "Vodka (Shot)",
                "subtitle": 40
            },
            {
                "title": "Tequila (Shot)",
                "subtitle": 40
            },
            {
                "title": "Whiskey (Shot)",
                "subtitle": 43
            },
            {
                "title": "Gin (Shot)",
                "subtitle": 40
            },
            {
                "title": "Rum (Shot)",
                "subtitle": 41
            }
        ]
    },
    {
        "title": "Wines",
        "items": [
            {
                "title": "White Wine (Glass)",
                "subtitle": 10
            },
            {
                "title": "Red Wine (Glass)",
                "subtitle": 15
            },
            {
                "title": "Pinot Grito (Glass)",
                "subtitle": 13
            },
            {
                "title": "Sake (Vase)",
                "subtitle": 16
            },
            {
                "title": "Chardonnay (Glass)",
                "subtitle": 14
            },
            {
                "title": "Port (Glass)",
                "subtitle": 19
            }
        ]
    }
];

    var main = new UI.Menu({
        sections: data
    });

    main.show();
    loadingCard.hide();

    main.on('select', function(e) {
        var recentDrinks = Settings.data('drinks') || 0;
        recentDrinks += 1;
        Settings.data('drinks', recentDrinks);

        console.log(recentDrinks);

        var bac = BACAt(recentDrinks, (new Date()).getTime() - Settings.data('startTime'), Settings.data('gender'), Settings.data('weight'));
        var timeTilSober = tForBAC(bac);
        var card = notify('Logging Drink', e.item.title, 'Your current BAC Level is: ' + bac.toFixed(3).toString() + '% and it will take you ' + timeTilSober.toFixed(1).toString() + ' hours to be totally sober.');
        main.hide();


        var whatever = function() {
            if (recentDrinks >= 7) {
                Settings.data('drinks', 0);
                setTimeout(function() {
                    Vibe.vibrate('short');
                    var ordrinCard = new UI.Card({
                        title: "Want to Ordr.in some PIZZA?",
                        body: '#HELLYEAH ->'
                    });
                    ordrinCard.show();
                    card.hide();
                    ordrinCard.on('click', 'select', function() {
                        var confirmationCard = new UI.Card({
                            title: "Ta Ta's Pizza is on its way!",
                            body: ':P'
                        });
                        confirmationCard.show();
                        ordrinCard.hide();
                        setTimeout(function() {
                            confirmationCard.hide();
                        }, 2000);
                    });
                }, 3000);   
            } else {
                setTimeout(function() {
                    card.hide();
                }, 3000);
            }
        };
        ajax({
            url: mainURL + '/drink',
            method: 'POST',
            data: {
                drinkId: e.item.title,
                email: Settings.data('email')
            }
        }, whatever, whatever);
        
    });

// }, function(err) {
//     // whelp, just give up, I guess
//     notify('Failed to load drinks.', 'I don\'t even know, dude.');
//     console.log('whelp.' + err);
// });


Settings.config({
    url: mainURL + (isLoggedIn ? '/register' : '/settings')
}, function(e) {
    //open
    console.log('open');
}, function(e) {
    // close
    console.log(JSON.stringify(e.options));
    if (!Settings.data('isLoggedIn')) {
        // first use, therefore data
        Settings.data('weight', e.options.weight);
        Settings.data('gender', e.options.gender === 'M');
        Settings.data('email', e.options.email);
        Settings.data('isLoggedIn', true);
    } else {
        Settings.data('startTime', (new Date()).getTime());
        Settings.data('drinks', 0);
    }
});