# tsUnit

tsUnit is a unit testing framework for TypeScript, written in TypeScript. It allows you to encapsulate your test functions in classes and modules.

Install via NuGet:

```PM> Install-Package tsUnit ```

NOTE: Version 2.0 has breaking changes, to improve re-use between different module systems. Please read the below to see how to use version 2.0.

tsUnit comes with...

 - Built-in assertion helpers
 - Built-in HTML or TAP output, or raw data
 - A test limiter that lets you click to re-play a test, or group of tests without re-running the whole suite (thanks to Paul Atryda)
 - An easy to use test-double generator

Simple!

It is so easy, you don't even have to download and unzip anything. It is just one file, written in TypeScript... just add tsUnit.ts to your project.

Please start a discussion if you think a feature is missing or doesn't work as expected.

## Example

```TypeScript
	import * as tsUnit from './Scripts/tsUnit/tsUnit';
	import * as Calculations from './Scripts/Calculations';

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

    // "The One Liner" - you can do this in multiple stages too
    var test = new tsUnit.Test(CalculationsTests).run().showResults('results');
```

The multi-line version is also available... in particular this is useful if you want to re-use the result (which you can display as HTML and retrieve TAP output from).

```
    // Creat the test suite
    var test = new tsUnit.Test(CalculationsTests);

	// Run the test
	var result = test.run();

	// Display in the element with id="results"
	result.showResults('results');
```

To run without a browser, you can call ```test.run()``` and use the raw result data yourself...

```TypeScript
    // Handle the results yourself...
    var result = new tsUnit.Test(CalculationsTests).run();
    
    var outcome = (result.errors.length === 0) ? 'Test Passed' : 'Test Failed';
```

Or you can use the TAP (Test Anything Protocol) output:

```TypeScript
    // TAP output...
    var tap = new tsUnit.Test(CalculationsTests).getTapResults();
    
    console.log(tap);
```

## License

   Copyright 2012 Steve Fenton

   Please read the LICENSE file for more details.
