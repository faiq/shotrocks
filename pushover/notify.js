 
var apiKey = 'a9BiZt5Y9zeWC7UoJtEr11411iv797';
var userKey = 'uYf8x6UxM9r9WV7qosodFK2RcP5ZdK';

var request = require('request');

module.exports = function(text) {
    request.post({
        url: 'https://api.pushover.net/1/messages.json',
        form: {
            token: apiKey,
            user: userKey,
            message: text
        }
    }, function(e) {
        if (e) {
            console.log(e);
        }
    });
}