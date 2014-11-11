import tsUnit = require('./Scripts/tsUnit/tsUnit');
import FizzBuzzTests = require('./Scripts/FizzBuzzTests');
import FizzBuzzParameterisedTests = require('./Scripts/FizzBuzzParameterisedTests');

// Instantiate tsUnit and pass in modules that contain tests
var test = new tsUnit.Test(FizzBuzzTests, FizzBuzzParameterisedTests);

// Show the test results
test.showResults(document.getElementById('result'), test.run());