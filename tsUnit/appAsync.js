define(["require", "exports", './Scripts/tsUnit/tsUnitAsync', './Scripts/tsUnit/Tests', './Scripts/tsUnit/BadTests', './Scripts/tsUnit/AsyncTests'], function (require, exports, tsUnit, Tests, BadTests, AsyncTests) {
    "use strict";
    // Instantiate tsUnit and pass in modules that contain tests
    var test = new tsUnit.TestAsync(AsyncTests, Tests, BadTests);
    // Run the test, result contains data about the test run
    test.runAsync().then((result) => {
        // get TAP output
        console.log(result.getTapResults());
        // show in browser (if there is one)
        result.showResults('result');
        // Or pass an HTMLElement
        //result.showResults(document.getElementById('result'));
        // Short version...
        //var result = new tsUnit.Test(Tests, BadTests).run().showResults('result');
    });
});
