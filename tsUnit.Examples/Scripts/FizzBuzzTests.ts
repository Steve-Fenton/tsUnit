module FizzBuzzTests {
    import FizzBuzz = Games.FizzBuzz;
    var target = new FizzBuzz();

    export class FizzBuzzTests extends tsUnit.TestClass {

        normalNumbersReturnOriginalNumber() {
            this.areIdentical('1', target.generate(1));
            this.areIdentical('2', target.generate(2));
            this.areIdentical('4', target.generate(4));
        }

        numberDivisibleByThreeShouldReturnFizz() {
            this.areIdentical(FizzBuzz.fizz, target.generate(3));
            this.areIdentical(FizzBuzz.fizz, target.generate(6));
            this.areIdentical(FizzBuzz.fizz, target.generate(9));
        }

        numbersDivisibleByFiveShouldReturnBuzz() {
            this.areIdentical(FizzBuzz.buzz, target.generate(5));
            this.areIdentical(FizzBuzz.buzz, target.generate(10));
            this.areIdentical(FizzBuzz.buzz, target.generate(20));
        }
        numbersDivisibleByThreeAndFiveShouldReturnFizzBuzz() {
            this.areIdentical(FizzBuzz.fizz + FizzBuzz.buzz, target.generate(15));
            this.areIdentical(FizzBuzz.fizz + FizzBuzz.buzz, target.generate(30));
            this.areIdentical(FizzBuzz.fizz + FizzBuzz.buzz, target.generate(45));
        }
    }
}