var tsUnit = require('./node_modules/tsunit.external/tsUnit');
var FizzBuzzTests = require('./Scripts/FizzBuzzTests');
var readline = require('readline');
var test = new tsUnit.Test(FizzBuzzTests);
var result = test.run();
console.log(result.getTapResults());
console.log('Errors: ' + result.errors.length);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Press any key to continue...", function () {
    rl.close();
});
