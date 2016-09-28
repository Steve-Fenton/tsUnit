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

 - Support for async testing (Version >= 2.0.2)

Simple!

It is so easy, you don't even have to download and unzip anything. It is just one file, written in TypeScript... just add tsUnit.ts to your project.

Please start a discussion if you think a feature is missing or doesn't work as expected.

## Example

Test modules look like this...

```TypeScript
    import * as tsUnit from './Scripts/tsUnit/tsUnit';
    import * as Calculations from './Scripts/Calculations';
	
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
```

Composing your test suite goes as follows...

```TypeScript
    import * as CalculationsTests from './Scripts/CalculationsTests';

    // "The One Liner" - you can do this in multiple stages too
    var test = new tsUnit.Test(CalculationsTests).run().showResults('results');
```

The multi-line version is also available... in particular this is useful if you want to re-use the result (which you can display as HTML and retrieve TAP output from).

```TypeScript
    // Create the test suite
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
    var tap = new tsUnit.Test(CalculationsTests).run().getTapResults();
    
    console.log(tap);
```
## Async testing

To support async tests you must use the ```TestAsync``` class and it's ```test.runAsync()``` method.

```TypeScript
    import * as CalculationsTests from './Scripts/CalculationsTests';

    // "The One Liner" - you can do this in multiple stages too
    var test = new tsUnit.TestAsync(CalculationsTests).runAsync().then((result) => result.showResults('results'));
```
Your test classes do not need to change unless you are writing an async test:

```TypeScript
    import * as tsUnit from './Scripts/tsUnit/tsUnit';
    import * as CalculationsAsync from './Scripts/CalculationsAsync';
	
    export class AsyncMathTests extends tsUnit.TestClass {
	
        private target = new CalculationsAsync.SimpleMath();
	
        addTwoNumbersAsynchronouslyWith1And2Expect3() {
            var promise = this.target.addTwoNumbers(1, 2);
	
            // return a promise:
            return promise.then((result) => {
                this.areIdentical(3, result);
            });
            
        }
    }
```

Note how the method from your ```CalculationsAsync``` module returns a promise 
that has to  be resolved before the result can be checked. 

In order to allow the test runner to detect when your code is finished, your 
test must be a chain of  promises (using ```.then```) and you must 
return the last promise in that chain.

The use of the ```=>``` operator allows us to access ```this``` -- if you use 
functions here you must provide access to the this of your test class:

```TypeScript
    import * as tsUnit from './Scripts/tsUnit/tsUnit';
    import * as CalculationsAsync from './Scripts/CalculationsAsync';
	
    export class AsyncMathTests extends tsUnit.TestClass {
	
        private target = new CalculationsAsync.SimpleMath();
	
        addTwoNumbersAsynchronouslyWith1And2Expect3() {
            var promise = this.target.addTwoNumbers(1, 2);
	
            // save this:
            var self = this;

            return promise.then(function (result) {
                self.areIdentical(3, result);
            });
            
        }
    }
```

Since your code is now asynchronous, you will also not be able to use 
```this.throws()``` to check that your code threw an exception. If you 
want to check that your result is a rejected promise, use test
code like this:

```TypeScript

    import * as tsUnit from './Scripts/tsUnit/tsUnit';
    import * as CalculationsAsync from './Scripts/CalculationsAsync';
	
    export class AsyncMathTests extends tsUnit.TestClass {
	
        private target = new CalculationsAsync.SimpleMath();
	
        divideByZeroAsynchronouslyIsRejected() {
            var promise = this.target.divide(1, 0);

            // use both parameters of then, second is onRejected callback:
            return p.then(() => {
                this.fail("expected promise to be rejected, got success");
            }, (err:Error) => {
                this.areIdentical("division by zero", err.message);
            })
        }
    }
```

## More options for async running

Since the one-liner gets a little bit out of hand, this is how a multiline version 
of the async runner looks.

```TypeScript
    // Create the test suite
    var test = new tsUnit.TestAsync(CalculationsTests);

    // Run the test
    var promise = test.runAsync();

    // await the result and show it

    promise.then(function(result) {
        // Display in the element with id="results"
        result.showResults('results');
    });
```

To run without a browser, you can call ```test.runAsync()``` and use the raw result data yourself...

```TypeScript
    // Handle the results yourself...
    var promise = new tsUnit.TestAsync(CalculationsTests).runAsync();
    
    promise.then(function(result) {
        var outcome = (result.errors.length === 0) ? 'Test Passed' : 'Test Failed';
    });
```

Or you can use the TAP (Test Anything Protocol) output:

```TypeScript
    // TAP output...
    // Handle the results yourself...
    var promise = new tsUnit.TestAsync(CalculationsTests).runAsync();

    promise.then(function(result) {
        var tap = result.getTapResults();
    
        console.log(tap);
    }
```

Remember, since the tests are run asynchronously, the results can only be
delivered asynchronously.

## License

   Copyright 2012-2016 Steve Fenton, async support was written by and is Copyright 2016 Harald Niesche

   Please read the LICENSE file for more details.
