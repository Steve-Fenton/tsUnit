"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsUnit = require("./node_modules/tsunit.external/tsUnit.js");
const FizzBuzzTests = require("./Scripts/FizzBuzzTests.js");
const readline = require("readline");
var test = new tsUnit.Test(FizzBuzzTests);
var result = test.run();
console.log(result.getTapResults());
console.log('Errors: ' + result.errors.length);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Press any key to continue...", () => {
    rl.close();
});
