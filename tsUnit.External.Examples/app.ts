import tsUnit = require('./Scripts/tsUnit/tsUnit');
import Tests = require('./Scripts/Tests');

window.onload = function () {
    // Instantiate tsUnit and pass in modules that contain tests
    var test = new tsUnit.Test(Tests);

    // Show the test results
    test.showResults(document.getElementById('result'), test.run());
};