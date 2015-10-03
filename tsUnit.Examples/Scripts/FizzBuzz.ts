export var fizz = 'Fizz';
export var buzz = 'Buzz';

export class Game {

    generate(input: number): string {
        var output = '';

        if (input % 3 === 0) {
            output += fizz;
        }

        if (input % 5 === 0) {
            output += buzz;
        }

        return output === '' ? input.toString() : output;
    }
}