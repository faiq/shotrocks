/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
// var Vector2 = require('vector2');


var notify = function(title, subtitle, body) {
    var card = new UI.Card();
    card.title(title);
    card.subtitle(subtitle);
    card.body(body);
    card.show();
};


ajax({
    url: 'http://matt.cond.in/hackru/drinks.json',
    type: 'json'
}, function(data) {
    var main = new UI.Menu({
        sections: [{
            items: data
        }]
    });

    main.show();

    main.on('select', function(e) {
        var recentDrinks = Settings.data('drinks') || [];
        recentDrinks.push(data[e.itemIndex].id);
        Settings.data('drinks', recentDrinks);
        console.log(data[e.itemIndex].id);
        // main.hide();
        // id = e.itemIndex;
        // notify('Yo!', data[e.itemIndex].title, data[e.itemIndex].subtitle);
    });

}, function(err) {
    // whelp, just give up, I guess
    console.log('whelp.' + err);
});

    // var main = new UI.Menu({
    //     sections: [{
    //        items: data
    //     }]
    // });

    // main.show();
 

// main.on('click', 'up', function(e) {
//   var menu = new UI.Menu({
//     sections: [{
//       items: [{
//         title: 'Pebble.js',
//         icon: 'images/menu_icon.png',
//         subtitle: 'Can do Menus'
//       }, {
//         title: 'Second Item',
//         subtitle: 'Subtitle Text'
//       }]
//     }]
//   });
//   menu.on('select', function(e) {
//     console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
//     console.log('The item is titled "' + e.item.title + '"');
//   });
//   menu.show();
// });

// main.on('click', 'select', function(e) {
//   var wind = new UI.Window();
//   var textfield = new UI.Text({
//     position: new Vector2(0, 50),
//     size: new Vector2(144, 30),
//     font: 'gothic-24-bold',
//     text: 'Text Anywhere!',
//     textAlign: 'center'
//   });
//   wind.add(textfield);
//   wind.show();
// });

// main.on('click', 'down', function(e) {
//   var card = new UI.Card();
//   card.title('A Card');
//   card.subtitle('Is a Window');
//   card.body('The simplest window type in Pebble.js.');
//   card.show();
// });


Settings.config({
    url: 'http://google.com'
}, function(e) {
    //open
    console.log('open');
}, function(e) {
    // close
    console.log(JSON.stringify(e.options));
    Settings.data('test', 'yay');
});