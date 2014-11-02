/// <reference path="./Scripts/tsUnit/tsUnit.ts" />
/// <reference path="./Scripts/Tests.ts" />

window.onload = function () {
    // Instantiate tsUnit and pass in modules that contain tests
    var test = new tsUnit.Test(Tests);

    // Show the test results
    test.showResults(document.getElementById('result'), test.run());
};