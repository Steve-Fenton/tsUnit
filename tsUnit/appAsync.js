(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Scripts/tsUnit/tsUnitAsync', './Scripts/tsUnit/Tests', './Scripts/tsUnit/BadTests', './Scripts/tsUnit/AsyncTests'], factory);
    }
})(function (require, exports) {
    "use strict";
    var tsUnit = require('./Scripts/tsUnit/tsUnitAsync');
    var Tests = require('./Scripts/tsUnit/Tests');
    var BadTests = require('./Scripts/tsUnit/BadTests');
    var AsyncTests = require('./Scripts/tsUnit/AsyncTests');
    // Instantiate tsUnit and pass in modules that contain tests
    var test = new tsUnit.TestAsync(AsyncTests, Tests, BadTests);
    // Run the test, result contains data about the test run
    var result = test.runAsync().then(function (result) {
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
