import tsUnit = require('../node_modules/tsunit.external/tsUnit');
import FizzBuzz = require('./FizzBuzz');

var target = new FizzBuzz();

export class FizzBuzzTests extends tsUnit.TestClass {

    normalNumbersReturnOriginalNumber() {
        this.areIdentical(1, target.generate(1));
        this.areIdentical(2, target.generate(2));
        this.areIdentical(4, target.generate(4));
    }

    numberDivisibleByThreeShouldReturnFizz() {
        this.areIdentical("Fizz", target.generate(3));
        this.areIdentical("Fizz", target.generate(6));
        this.areIdentical("Fizz", target.generate(9));
    }

    numbersDivisibleByFiveShouldReturnBuzz() {
        this.areIdentical("Buzz", target.generate(5));
        this.areIdentical("Buzz", target.generate(10));
        this.areIdentical("Buzz", target.generate(20));
    }
    numbersDivisibleByThreeAndFiveShouldReturnFizzBuzz() {
        this.areIdentical("FizzBuzz", target.generate(15));
        this.areIdentical("FizzBuzz", target.generate(30));
        this.areIdentical("FizzBuzz", target.generate(45));
    }
}