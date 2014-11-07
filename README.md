tsUnit
======

tsUnit is a unit testing framework for TypeScript, written in TypeScript. It allows you to encapsulate your test functions in classes and modules.

Install via NuGet:

```PM> Install-Package tsUnit ```

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

    module CalculationsTests {
        export class SimpleMathTests extends tsUnit.TestClass {
    
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
    }

    // new instance of tsUnit - pass in modules that contain test classes
    var test = new tsUnit.Test(CalculationsTests);

    // Use the built in results display
    test.showResults(document.getElementById('results'), test.run());
```

To run without a browser, you can call ```test.run()``` and use the raw result data yourself...

```
    // new instance of tsUnit - pass in modules that contain test classes
    var test = new tsUnit.Test(CalculationsTests);

    // Handle the results yourself...
    var result = test.run());
    
    var outcome = (result.errors.length === 0) ? 'Test Passed' : 'Test Failed';
```

License
=======

   Copyright 2012 Steve Fenton

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
