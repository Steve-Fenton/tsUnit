(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './tsUnit', './tsUnit'], factory);
    }
})(function (require, exports) {
    "use strict";
    const tsUnit_1 = require('./tsUnit');
    var tsUnit_2 = require('./tsUnit');
    exports.Test = tsUnit_2.Test;
    exports.TestContext = tsUnit_2.TestContext;
    exports.TestClass = tsUnit_2.TestClass;
    exports.FakeFactory = tsUnit_2.FakeFactory;
    exports.TestDescription = tsUnit_2.TestDescription;
    exports.TestDefinition = tsUnit_2.TestDefinition;
    class TestAsync extends tsUnit_1.Test {
        runAll(tests, testRunLimiter) {
            let thisTest = tests[0];
            var testClass = thisTest.testClass;
            var dynamicTestClass = testClass;
            var testsGroupName = thisTest.name;
            var propertyNames = tsUnit_1.FunctionPropertyHelper.getFunctionNames(testClass);
            let functions = [];
            for (var j = 0; j < propertyNames.length; j++) {
                let unitTestName = propertyNames[j];
                if (!this.isReservedFunctionName(unitTestName) &&
                    !(unitTestName.substring(0, this.privateMemberPrefix.length) === this.privateMemberPrefix) &&
                    !(typeof dynamicTestClass[unitTestName] !== 'function') &&
                    (!testRunLimiter || testRunLimiter.isTestActive(unitTestName))) {
                    functions.push(unitTestName);
                }
            }
            let remainingTests = tests.slice(1);
            var promise = this.runAllFunctions(thisTest, functions, testRunLimiter);
            if (remainingTests.length) {
                return promise.then(() => this.runAll(remainingTests, testRunLimiter));
            }
            return promise;
        }
        runAllFunctions(thisTest, functionNames, testRunLimiter) {
            let unitTestName = functionNames[0];
            let remainingFunctions = functionNames.slice(1);
            var testClass = thisTest.testClass;
            var dynamicTestClass = testClass;
            var testsGroupName = thisTest.name;
            var promise;
            if (typeof dynamicTestClass[unitTestName].parameters !== 'undefined') {
                let parameters = dynamicTestClass[unitTestName].parameters;
                promise = this.runAllParameters(thisTest, unitTestName, 0, testRunLimiter);
            }
            else {
                promise = this.runSingleTestAsync(testClass, unitTestName, testsGroupName);
            }
            if (remainingFunctions.length > 0) {
                promise = promise.then(() => this.runAllFunctions(thisTest, remainingFunctions, testRunLimiter));
            }
            promise.then((x) => {
                testClass.tearDown && testClass.tearDown();
                return x;
            }, (err) => {
                testClass.tearDown && testClass.tearDown();
                throw err;
            });
            return promise;
        }
        runAllParameters(thisTest, unitTestName, parameterIndex, testRunLimiter) {
            let testClass = thisTest.testClass;
            let dynamicTestClass = testClass;
            let testsGroupName = thisTest.name;
            let parameters = dynamicTestClass[unitTestName].parameters;
            let maxIndex = parameters.length - 1;
            var index = parameterIndex;
            if (testRunLimiter) {
                while (index < parameters.length && !testRunLimiter.isParametersSetActive(index)) {
                    ++index;
                }
            }
            if (index < parameters.length) {
                return this.runSingleTestAsync(testClass, unitTestName, testsGroupName, parameters, index)
                    .then(() => this.runAllParameters(thisTest, unitTestName, index + 1, testRunLimiter));
            }
            return Promise.resolve(this);
        }
        runSingleTestAsync(testClass, unitTestName, testsGroupName, parameters = null, parameterSetIndex = null) {
            testClass.setUp && testClass.setUp();
            // running everything inside .then saves us a try/catch
            return Promise.resolve().then(() => {
                var dynamicTestClass = testClass;
                var args = (parameterSetIndex !== null) ? parameters[parameterSetIndex] : null;
                return dynamicTestClass[unitTestName].apply(testClass, args);
            }).then(() => {
                this.passes.push(new tsUnit_1.TestDescription(testsGroupName, unitTestName, parameterSetIndex, 'OK'));
                return this;
            }, (err) => {
                this.errors.push(new tsUnit_1.TestDescription(testsGroupName, unitTestName, parameterSetIndex, err.toString()));
                return this;
            });
        }
        runAsync(testRunLimiter = null) {
            var parameters = null;
            var testContext = new tsUnit_1.TestContext();
            if (testRunLimiter == null) {
                testRunLimiter = this.testRunLimiter;
            }
            var tests = this.tests;
            if (testRunLimiter) {
                tests = tests.filter((x) => testRunLimiter.isTestsGroupActive(x.name));
            }
            return this.runAll(tests, testRunLimiter);
        }
        run() {
            console.log("use runAsync");
            throw new Error("use runAsync");
        }
    }
    exports.TestAsync = TestAsync;
});
//# sourceMappingURL=tsUnitAsync.js.map