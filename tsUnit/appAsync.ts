import * as tsUnit from './Scripts/tsUnit/tsUnitAsync';
import * as Tests from './Scripts/tsUnit/Tests';
import * as BadTests from './Scripts/tsUnit/BadTests';
import * as AsyncTests from './Scripts/tsUnit/AsyncTests';

// Instantiate tsUnit and pass in modules that contain tests
var test = new tsUnit.TestAsync(AsyncTests, Tests, BadTests);

// Run the test, result contains data about the test run
var result = test.runAsync().then((result) => {
  // get TAP output
  console.log(result.getTapResults());

  // show in browser (if there is one)
  result.showResults('result')

  // Or pass an HTMLElement
  //result.showResults(document.getElementById('result'));


  // Short version...
  //var result = new tsUnit.Test(Tests, BadTests).run().showResults('result');
});

