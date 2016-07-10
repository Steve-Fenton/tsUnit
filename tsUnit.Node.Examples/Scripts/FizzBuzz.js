"use strict";
var FizzBuzz = (function () {
    function FizzBuzz() {
    }
    FizzBuzz.prototype.generate = function (input) {
        var output = '';
        if (input % 3 === 0) {
            output += 'Fizz';
        }
        if (input % 5 === 0) {
            output += 'Buzz';
        }
        return output === '' ? input : output;
    };
    return FizzBuzz;
}());
module.exports = FizzBuzz;
