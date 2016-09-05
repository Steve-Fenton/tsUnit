///<reference path="./promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './tsUnit', './tsUnit'], factory);
    }
})(function (require, exports) {
    "use strict";
    var tsUnit_1 = require('./tsUnit');
    var tsUnit_2 = require('./tsUnit');
    exports.Test = tsUnit_2.Test;
    exports.TestContext = tsUnit_2.TestContext;
    exports.TestClass = tsUnit_2.TestClass;
    exports.FakeFactory = tsUnit_2.FakeFactory;
    exports.TestDescription = tsUnit_2.TestDescription;
    exports.TestDefinition = tsUnit_2.TestDefinition;
    var TestAsync = (function (_super) {
        __extends(TestAsync, _super);
        function TestAsync() {
            _super.apply(this, arguments);
        }
        TestAsync.prototype.runAll = function (tests, testRunLimiter) {
            var _this = this;
            var thisTest = tests[0];
            var testClass = thisTest.testClass;
            var dynamicTestClass = testClass;
            var testsGroupName = thisTest.name;
            var functions = [];
            for (var unitTestName in testClass) {
                if (!this.isReservedFunctionName(unitTestName)
                    && !(unitTestName.substring(0, this.privateMemberPrefix.length) === this.privateMemberPrefix)
                    && !(typeof dynamicTestClass[unitTestName] !== 'function')
                    && (!testRunLimiter || testRunLimiter.isTestActive(unitTestName))) {
                    functions.push(unitTestName);
                }
            }
            var remainingTests = tests.slice(1);
            var promise = this.runAllFunctions(thisTest, functions, testRunLimiter);
            if (remainingTests.length) {
                return promise.then(function () { return _this.runAll(remainingTests, testRunLimiter); });
            }
            return promise;
        };
        TestAsync.prototype.runAllFunctions = function (thisTest, functionNames, testRunLimiter) {
            var _this = this;
            var unitTestName = functionNames[0];
            var remainingFunctions = functionNames.slice(1);
            var testClass = thisTest.testClass;
            var dynamicTestClass = testClass;
            var testsGroupName = thisTest.name;
            var promise;
            if (typeof dynamicTestClass[unitTestName].parameters !== 'undefined') {
                var parameters = dynamicTestClass[unitTestName].parameters;
                promise = this.runAllParameters(thisTest, unitTestName, 0, testRunLimiter);
            }
            else {
                promise = this.runSingleTestAsync(testClass, unitTestName, testsGroupName);
            }
            if (remainingFunctions.length > 0) {
                promise = promise.then(function () { return _this.runAllFunctions(thisTest, remainingFunctions, testRunLimiter); });
            }
            promise.then(function (x) {
                testClass.tearDown && testClass.tearDown();
                return x;
            }, function (err) {
                testClass.tearDown && testClass.tearDown();
                throw err;
            });
            return promise;
        };
        TestAsync.prototype.runAllParameters = function (thisTest, unitTestName, parameterIndex, testRunLimiter) {
            var _this = this;
            var testClass = thisTest.testClass;
            var dynamicTestClass = testClass;
            var testsGroupName = thisTest.name;
            var parameters = dynamicTestClass[unitTestName].parameters;
            var maxIndex = parameters.length - 1;
            var index = parameterIndex;
            if (testRunLimiter) {
                while (index < parameters.length && !testRunLimiter.isParametersSetActive(index)) {
                    ++index;
                }
            }
            if (index < parameters.length) {
                return this.runSingleTestAsync(testClass, unitTestName, testsGroupName, parameters, index)
                    .then(function () { return _this.runAllParameters(thisTest, unitTestName, index + 1, testRunLimiter); });
            }
            return Promise.resolve(this);
        };
        TestAsync.prototype.runSingleTestAsync = function (testClass, unitTestName, testsGroupName, parameters, parameterSetIndex) {
            var _this = this;
            if (parameters === void 0) { parameters = null; }
            if (parameterSetIndex === void 0) { parameterSetIndex = null; }
            testClass.setUp && testClass.setUp();
            // running everything inside .then saves us a try/catch
            return Promise.resolve().then(function () {
                var dynamicTestClass = testClass;
                var args = (parameterSetIndex !== null) ? parameters[parameterSetIndex] : null;
                return dynamicTestClass[unitTestName].apply(testClass, args);
            }).then(function () {
                _this.passes.push(new tsUnit_1.TestDescription(testsGroupName, unitTestName, parameterSetIndex, 'OK'));
                return _this;
            }, function (err) {
                _this.errors.push(new tsUnit_1.TestDescription(testsGroupName, unitTestName, parameterSetIndex, err.toString()));
                return _this;
            });
        };
        TestAsync.prototype.runAsync = function (testRunLimiter) {
            if (testRunLimiter === void 0) { testRunLimiter = null; }
            var parameters = null;
            var testContext = new tsUnit_1.TestContext();
            if (testRunLimiter == null) {
                testRunLimiter = this.testRunLimiter;
            }
            var tests = this.tests;
            if (testRunLimiter) {
                tests = tests.filter(function (x) { return testRunLimiter.isTestsGroupActive(x.name); });
            }
            return this.runAll(tests, testRunLimiter);
        };
        TestAsync.prototype.run = function () {
            console.log("use runAsync");
            throw new Error("use runAsync");
        };
        return TestAsync;
    }(tsUnit_1.Test));
    exports.TestAsync = TestAsync;
});
