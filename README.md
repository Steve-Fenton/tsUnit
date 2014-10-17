tsUnit
======

tsUnit is a unit testing framework for TypeScript, written in TypeScript. It allows you to encapsulate your test functions in classes and modules.

tsUnit is a TypeScript unit testing framework that allows you to define your unit tests inside TypeScript classes and modules.

tsUnit has built-in assertion helpers you can use in your test.

You can use the built-in output to display the test results, or take the test results and customise how they are displayed.

Paul Atryda has also added a neat test-limiter that let's you replay individual tests, groups of tests, or all the of the tests.

Simple!

It is so easy, you don't even have to download and unzip anything. It is just one file, written in TypeScript... just add tsUnit.ts to your project.

Please start a discussion if you think a feature is missing or doesn't work as expected.
Example

```TypeScript
    /// <reference path="tsUnit.ts" />
    /// <reference path="Calculations.ts" />

    class SimpleMathTests extends tsUnit.TestClass {

        private target = new Calculations.SimpleMath();

        addTwoNumbersWith1And2Expect3() {
            var result = this.target.addTwoNumbers(1, 2);

            this.areIdentical(3, result);
        }

        addTwoNumbersWith3And2Expect5() {
            var result = this.target.addTwoNumbers(3, 2);

            this.areIdentical(4, result); // Deliberate error
        }
    }

    // new instance of tsUnit - pass in modules that contain test classes
    var test = new tsUnit.Test(SimpleMathTests);

    // Use the built in results display
    test.showResults(document.getElementById('results'), test.run());
```

