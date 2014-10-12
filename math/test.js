
var BACAt = require('./BAC_to_the_basics');

var drinks = [
    {
        "title": "Normal Beer",
        "subtitle": 5
    },
    {
        "title": "Vodka (Shot)",
        "subtitle": 40
    }
];

console.log(BACAt(drinks, 1, true, 200));