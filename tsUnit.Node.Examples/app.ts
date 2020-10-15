import * as tsUnit from './node_modules/tsunit.external/tsUnit.js';
import * as FizzBuzzTests from './Scripts/FizzBuzzTests.js';
import * as readline from 'readline';

// Instantiate tsUnit and pass in modules that contain tests
var test = new tsUnit.Test(FizzBuzzTests);

// Run the tests
var result = test.run();

// Show the test results (TAP output)
console.log(result.getTapResults());

// Show the test results (Your own custom version)
console.log('Errors: ' + result.errors.length);

// Pause the console (the human version... not needed for automation)
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Press any key to continue...", () => {
    rl.close();
});