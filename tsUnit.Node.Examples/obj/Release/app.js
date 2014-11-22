var tsUnit = require('./Scripts/tsUnit/tsUnit');
var FizzBuzzTests = require('./Scripts/FizzBuzzTests');
var readline = require('readline');
// Instantiate tsUnit and pass in modules that contain tests
var test = new tsUnit.Test(FizzBuzzTests);
// Show the test results
var result = test.run();
console.log(test.showResults(result));
console.log(result.errors.length);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Press any key to continue...", function (answer) {
    rl.close();
});
//# sourceMappingURL=app.js.map