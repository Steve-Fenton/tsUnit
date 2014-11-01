/// <reference path="./tsUnit.ts" />

module Tests {
    export class RealClass {
        public name = 'Real';
        run() {
            return false;
        }
        returnValue(): RealClass {
            return this;
        }
    }

    class SetUpTestClassStub extends tsUnit.TestClass {
        public TestProperty: string = '';

        setUp() {
            this.TestProperty = 'SETUP';
        }

        testAfterInitialSetUp() {
            this.areIdentical('SETUP', this.TestProperty);
            this.TestProperty = 'OVERWRITE';
        }

        testOfSetUpWithFail() {
            this.areIdentical('SETUP', this.TestProperty);
            throw "Internal test error: Thrown by testOfSetUpWithFail";
        }

        testNextInStub() {
            this.areIdentical('SETUP', this.TestProperty);
            this.TestProperty = 'OVERWRITE';
        }
    }

    class SetUpWithParametersTestClassStub extends tsUnit.TestClass {
        public TestProperty: string = '';

        constructor() {
            super();
            this.parameterizeUnitTest(this.testSum, [
                [2, 1],
                [3, 2],
                [4, 3]
            ]);
        }

        setUp() {
            this.TestProperty = 'SETUP';
        }

        testSum(a: number, b: number) {
            this.areIdentical('SETUP', this.TestProperty);
            this.areIdentical(a, b + 1);

            this.TestProperty = 'OVERWRITE';
        }
    }

    class TearDownTestClassStub extends tsUnit.TestClass {
        public TestProperty: string = '';

        testAfterInitialSetUp() {
            this.areIdentical('', this.TestProperty);
            this.TestProperty = 'OVERWRITE';
        }

        tearDown() {
            this.TestProperty = 'TEARDOWN';
        }
    }

    class TearDownWithFailingTestClassStub extends tsUnit.TestClass {
        public TestProperty: string = '';

        testWhichWillFail() {
            this.areIdentical('', this.TestProperty);
            this.TestProperty = 'OVERWRITE';
            throw "Internal test error: Thrown by testWhichWillFail";
        }

        tearDown() {
            this.TestProperty = 'TEARDOWN';
        }
    }

    class TearDownTestWithParametersTestClassStub extends tsUnit.TestClass {
        public tearDownCounter = 0;

        constructor() {
            super();
            this.parameterizeUnitTest(this.testForTearDown, [
                [0],
                [1],
                [2]
            ]);
        }

        testForTearDown(index) {
            this.areIdentical(index, this.tearDownCounter);
        }

        tearDown() {
            this.tearDownCounter++;
        }
    }

    export class TearDownAndSetUpTests extends tsUnit.TestClass {
        testOfSetUp() {
            var stub = new SetUpTestClassStub();
            var testPropertyOnBegin = stub.TestProperty;
            var test = new tsUnit.Test();

            test.addTestClass(stub, 'SetUpTestClassStub');
            var results = test.run(new tsUnit.RunAllTests());

            this.areIdentical(testPropertyOnBegin, '', "TestProperty should be empty on start");
            this.isTrue((results.passes.length == 2) && (results.errors.length == 1), "All internal tests should passed (appertly setUp didn't work)");
        }

        testOfSetUpWithParameters() {
            var stub = new SetUpWithParametersTestClassStub();
            var testPropertyOnBegin = stub.TestProperty;
            var test = new tsUnit.Test();

            test.addTestClass(stub, 'SetUpWithParametersTestClassStub');
            var results = test.run(new tsUnit.RunAllTests());

            this.areIdentical(testPropertyOnBegin, '', "TestProperty should be empty on start");
            this.isTrue((results.passes.length == 3) && (results.errors.length == 0), "All internal tests should passed (appertly setUp didn't work)");
        }

        testOfTearDown() {
            var stub = new TearDownTestClassStub();
            var testPropertyOnBegin = stub.TestProperty;
            var test = new tsUnit.Test();

            test.addTestClass(stub, 'TearDownTestClassStub');
            test.run(new tsUnit.RunAllTests());

            this.areIdentical(testPropertyOnBegin, '', "TestProperty should be empty on start");
            this.areIdentical(stub.TestProperty, 'TEARDOWN', "TestProperty should be overwrite by TearDown method");
        }

        testTearDownWithFailedTest() {
            var stub = new TearDownWithFailingTestClassStub();
            var testPropertyOnBegin = stub.TestProperty;
            var test = new tsUnit.Test();

            test.addTestClass(stub, 'TearDownWithFailingTestClassStub');
            test.run(new tsUnit.RunAllTests());

            this.areIdentical(testPropertyOnBegin, '', "TestProperty should be empty on start");
            this.areIdentical(stub.TestProperty, 'TEARDOWN', "TestProperty should be overwrite by TearDown method");
        }

        testTearDownWithParameters() {
            var stub = new TearDownTestWithParametersTestClassStub();
            var test = new tsUnit.Test();

            test.addTestClass(stub, 'TearDownTestWithParametersTestClassStub');
            var results = test.run(new tsUnit.RunAllTests());

            this.areIdentical(3, stub.tearDownCounter);
            this.isTrue((results.passes.length == 3) && (results.errors.length == 0), "All internal tests should passed (appertly setUp didn't work)");
        }
    }

    export class FakesTests extends tsUnit.TestClass {

        callDefaultFunctionOnFake() {
            var fakeObject = new tsUnit.Fake<RealClass>(new RealClass());
            var target = fakeObject.create();

            var result = target.run();

            this.areIdentical(undefined, result);
        }

        callSubstituteFunctionOnFake() {
            var fakeObject = new tsUnit.Fake<RealClass>(new RealClass());
            fakeObject.addFunction('run', function () { return true; });
            var target = fakeObject.create();

            var result = target.run();

            this.isTrue(result);
        }

        callSubstituteFunctionToObtainSecondFake() {
            var innerFake = new tsUnit.Fake<RealClass>(new RealClass());
            innerFake.addFunction('run', function () { return true; });
            var outerFake = new tsUnit.Fake<RealClass>(new RealClass());
            outerFake.addFunction('returnValue', function () { return <RealClass> innerFake.create(); });
            var target = <any> outerFake.create();

            var interimResult = target.returnValue();
            var result = interimResult.run();

            this.isTrue(result);
        }

        callDefaultPropertyOnFake() {
            var fakeObject = new tsUnit.Fake<RealClass>(new RealClass());
            var target = fakeObject.create();

            var result = target.name;

            this.areIdentical(null, result);
        }

        callSubstitutePropertyOnFake() {
            var fakeObject = new tsUnit.Fake<RealClass>(new RealClass());
            fakeObject.addProperty('name', 'Test');
            var target = fakeObject.create();

            var result = target.name;

            this.areIdentical('Test', result);
        }
    }

    export class AssertAreIdenticalTests extends tsUnit.TestClass {
        withIdenticalNumbers() {
            this.areIdentical(5, 5);
        }

        withDifferentNumbers() {
            this.throws(function () {
                this.areIdentical(5, 4);
            });
        }

        withIdenticalStings() {
            this.areIdentical('Hello', 'Hello');
        }

        withDifferentStrings() {
            this.throws(function () {
                this.areIdentical('Hello', 'Jello');
            });
        }

        withSameInstance() {
            var x = { test: 'Object' };
            var y = x;
            this.areIdentical(x, y);
        }

        withDifferentInstance() {
            this.throws(function () {
                var x = { test: 'Object' };
                var y = { test: 'Object' };
                this.areIdentical(x, y);
            });
        }

        withDifferentTypes() {
            this.throws(function () {
                this.areIdentical('1', 1);
            });
        }

        withIdenticalCollections() {
            var x = [1, 2, 3, 5];
            var y = [1, 2, 3, 5];

            this.areCollectionsIdentical(x, y);
        }

        withDifferentCollections() {
            var x = [1, 2, 3, 5];
            var y = [1, 2, 4, 5];

            this.throws(function () {
                this.areCollectionsIdentical(x, y);
            });
        }
    }

    export class AssertAreNotIdenticalTests extends tsUnit.TestClass {
        withIdenticalNumbers() {
            this.throws(function () {
                this.areNotIdentical(4, 4);
            });
        }

        withDifferentNumbers() {
            this.areNotIdentical(4, -4);
        }

        withIdenticalStrings() {
            this.throws(function () {
                this.areNotIdentical('Hello', 'Hello');
            });
        }

        withDifferentStrings() {
            this.areNotIdentical('Hello', 'Hella');
        }

        withSameInstance() {
            this.throws(function () {
                var x = { test: 'Object' };
                var y = x;
                this.areNotIdentical(x, y);
            });
        }

        withDifferentInstance() {
            var x = { test: 'Object' };
            var y = { test: 'Object' };
            this.areNotIdentical(x, y);
        }

        withDifferentTypes() {
            this.areNotIdentical('1', 1);
        }

        withIdenticalCollections() {
            var x = [1, 2, 3, 5];
            var y = [1, 2, 3, 5];

            this.throws(function () {
                this.areCollectionsNotIdentical(x, y);
            });
        }

        withDifferentCollections() {
            var x = [1, 2, 3, 5];
            var y = [1, 2, 4, 5];

            this.areCollectionsNotIdentical(x, y);
        }
    }

    export class IsTrueTests extends tsUnit.TestClass {
        withBoolTrue() {
            this.isTrue(true);
        }

        withBoolFalse() {
            this.throws(function () {
                this.isTrue(false);
            });
        }
    }

    export class IsFalseTests extends tsUnit.TestClass {
        withBoolFalse() {
            this.isFalse(false);
        }

        withBoolTrue() {
            this.throws(function () {
                this.isFalse(true);
            });
        }
    }

    export class IsTruthyTests extends tsUnit.TestClass {
        withBoolTrue() {
            this.isTruthy(true);
        }

        withNonEmptyString() {
            this.isTruthy('Hello');
        }

        withTrueString() {
            this.isTruthy('True');
        }

        with1() {
            this.isTruthy(1);
        }

        withBoolFalse() {
            this.throws(function () {
                this.isTruthy(false);
            });
        }

        withEmptyString() {
            this.throws(function () {
                this.isTruthy('');
            });
        }

        withZero() {
            this.throws(function () {
                this.isTruthy(0);
            });
        }

        withNull() {
            this.throws(function () {
                this.isTruthy(null);
            });
        }

        withUndefined() {
            this.throws(function () {
                this.isTruthy(undefined);
            });
        }
    }

    export class IsFalseyTests extends tsUnit.TestClass {
        withBoolFalse() {
            this.isFalsey(false);
        }

        withEmptyString() {
            this.isFalsey('');
        }

        withZero() {
            this.isFalsey(0);
        }

        withNull() {
            this.isFalsey(null);
        }

        withUndefined() {
            this.isFalsey(undefined);
        }

        withBoolTrue() {
            this.throws(function () {
                this.isFalsey(true);
            });
        }

        withNonEmptyString() {
            this.throws(function () {
                this.isFalsey('Hello');
            });
        }

        withTrueString() {
            this.throws(function () {
                this.isFalsey('True');
            });
        }

        with1() {
            this.throws(function () {
                this.isFalsey(1);
            });
        }
    }

    export class FailTests extends tsUnit.TestClass {
        expectFails() {
            this.throws(function () {
                this.fail();
            });
        }
    }

    export class ExecutesWithinTests extends tsUnit.TestClass {
        withFastFunction() {
            this.executesWithin(() => {
                var start = window.performance.now();
                while ((window.performance.now() - start) < 20) { }
            }, 100);
        }

        withSlowFunction() {
            this.throws(() => {
                this.executesWithin(() => {
                    var start = window.performance.now();
                    while ((window.performance.now() - start) < 101) { }
                }, 100);
            });
        }

        withFailingFunction() {
            this.throws(() => {
                this.executesWithin(() => {
                    var start = window.performance.now();
                    throw 'Error';
                }, 100);
            });
        }
    }

    export class ParameterizedTests extends tsUnit.TestClass {
        constructor() {
            super();

            this.parameterizeUnitTest(this.sumTests, [
                [1, 1, 2],
                [2, 3, 5],
                [4, 5, 9]
            ]);

            this.parameterizeUnitTest(this.nonSumTests, [
                [1, 1, 1],
                [4, 5, 1]
            ]);
        }

        sumTests(a: number, b: number, sum: number) {
            var c = a + b;
            this.areIdentical(c, sum);
        }

        nonSumTests(a: number, b: number, notsum: number) {
            var c = a + b;
            this.areNotIdentical(c, notsum);
        }

        normalTest() {
            this.isTrue(true);
        }
    }
}