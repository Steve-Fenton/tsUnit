import * as FizzBuzz from './FizzBuzz';
import * as tsUnit from './tsUnit/tsUnit';

var target = new FizzBuzz.Game();

export class FizzBuzzParameterisedTests extends tsUnit.TestClass {

    constructor() {
        super();

        // Runs the expectCorrectOutputFor method with each of the cases listed.
        this.parameterizeUnitTest(this.expectCorrectOutputFor,
            [
                [1, '1'],
                [2, '2'],
                [3, 'Fizz'],
                [4, '4'],
                [5, 'Buzz'],
                [6, 'Fizz'],
                [9, 'Fizz'],
                [10, 'Buzz'],
                [15, 'FizzBuzz'],
                [20, 'Buzz'],
                [30, 'FizzBuzz'],
                [45, 'FizzBuzz']
            ]);
    }

    expectCorrectOutputFor(input: number, expected: string) {
        this.areIdentical(expected, target.generate(input));
    }
}
