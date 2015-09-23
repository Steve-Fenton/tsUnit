module Games {
    export class FizzBuzz {
        static fizz = 'Fizz';
        static buzz = 'Buzz';

        generate(input: number): string {
            var output = '';

            if (input % 3 === 0) {
                output += FizzBuzz.fizz;
            }

            if (input % 5 === 0) {
                output += FizzBuzz.buzz;
            }

            return output === '' ? input.toString() : output;
        }
    }
}