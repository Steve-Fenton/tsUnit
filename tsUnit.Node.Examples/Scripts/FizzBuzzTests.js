var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tsUnit = require('./tsUnit/tsUnit');
var FizzBuzz = require('./FizzBuzz');

var target = new FizzBuzz();

var FizzBuzzTests = (function (_super) {
    __extends(FizzBuzzTests, _super);
    function FizzBuzzTests() {
        _super.apply(this, arguments);
    }
    FizzBuzzTests.prototype.normalNumbersReturnOriginalNumber = function () {
        this.areIdentical(1, target.generate(1));
        this.areIdentical(2, target.generate(2));
        this.areIdentical(4, target.generate(4));
    };

    FizzBuzzTests.prototype.numberDivisibleByThreeShouldReturnFizz = function () {
        this.areIdentical("Fizz", target.generate(3));
        this.areIdentical("Fizz", target.generate(6));
        this.areIdentical("Fizz", target.generate(9));
    };

    FizzBuzzTests.prototype.numbersDivisibleByFiveShouldReturnBuzz = function () {
        this.areIdentical("Buzz", target.generate(5));
        this.areIdentical("Buzz", target.generate(10));
        this.areIdentical("Buzz", target.generate(20));
    };
    FizzBuzzTests.prototype.numbersDivisibleByThreeAndFiveShouldReturnFizzBuzz = function () {
        this.areIdentical("FizzBuzz", target.generate(15));
        this.areIdentical("FizzBuzz", target.generate(30));
        this.areIdentical("FizzBuzz", target.generate(45));
    };
    return FizzBuzzTests;
})(tsUnit.TestClass);
exports.FizzBuzzTests = FizzBuzzTests;
//# sourceMappingURL=FizzBuzzTests.js.map
