
var FEMALE_WATER_WEIGHT = 0.49;
var FEMALE_METABOLISM = 0.017;
var MALE_WATER_WEIGHT = 0.58;
var MALE_METABOLISM = 0.015;

var LBS_TO_KG = 0.453592;

module.exports = function BACAt(drinks, t, gender, weight) {
    // function of time (in decimal hours) that returns BAC level based on drinks in database

    var std_drinks = drinks.length;

    // if there are no more drinks, BAC level decreases at 0.015/hour
    var bac = ((0.806 * std_drinks * 1.2) / ((gender?MALE_WATER_WEIGHT:FEMALE_WATER_WEIGHT) * weight*LBS_TO_KG)) -
        ((gender?MALE_METABOLISM:FEMALE_METABOLISM) * t);

    return bac;
}