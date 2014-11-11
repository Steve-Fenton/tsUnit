window.onload = function () {
    // Instantiate tsUnit and pass in modules that contain tests
    var test = new tsUnit.Test(Tests, BadTests);

    // Show the test results
    test.showResults(document.getElementById('result'), test.run());
};