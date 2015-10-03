import * as tsUnit from './Scripts/tsUnit/tsUnit';
import * as Tests from './Scripts/tsUnit/Tests';
import * as BadTests from './Scripts/tsUnit/BadTests';

// Instantiate tsUnit and pass in modules that contain tests
var test = new tsUnit.Test(Tests, BadTests);

// Run the test, result contains data about the test run
var result = test.run().showResults('result');

// Or pass an HTMLElement
//result.showResults(document.getElementById('result'));

// Or get TAP output
console.log(result.getTapResults());

// Short version...
//var result = new tsUnit.Test(Tests, BadTests).run().showResults('result');
