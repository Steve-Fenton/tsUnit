window.onload = function () {
    // Instantiate tsUnit and pass in modules that contain tests
    var test = new tsUnit.Test(Tests, BadTests);

    // Run the test
    var testResult = test.run();

    // Show the test results
    test.showResults(document.getElementById('result'), testResult);

    // Or get TAP output
    console.log(test.getTapResults(testResult));
};