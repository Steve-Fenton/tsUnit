
///<reference path="./promise.d.ts" />

import {
    Test,
    TestContext,
    TestClass,
    FakeFactory,
    ITestRunLimiter,
    TestDescription,
    TestDefinition
} from './tsUnit';

export {
    Test,
    TestContext,
    TestClass,
    FakeFactory,
    ITestRunLimiter,
    TestDescription,
    TestDefinition
} from './tsUnit';



export class TestAsync extends Test {

    private _currentTestPromises: Promise<any>[];

    private runAll(tests: TestDefinition[], testRunLimiter: ITestRunLimiter): Promise<this> {
        let thisTest = tests[0];
        var testClass = thisTest.testClass;
        var dynamicTestClass = <any>testClass;
        var testsGroupName = thisTest.name;

        let functions: string[] = [];
        for (var unitTestName in testClass) {
            if (!this.isReservedFunctionName(unitTestName)
                && !(unitTestName.substring(0, this.privateMemberPrefix.length) === this.privateMemberPrefix)
                && !(typeof dynamicTestClass[unitTestName] !== 'function')
                && (!testRunLimiter || testRunLimiter.isTestActive(unitTestName))) {
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

    private runAllFunctions(thisTest: TestDefinition, functionNames: string[], testRunLimiter: ITestRunLimiter): Promise<this> {
        let unitTestName = functionNames[0];
        let remainingFunctions = functionNames.slice(1);
        var testClass = thisTest.testClass;
        var dynamicTestClass = <any>testClass;
        var testsGroupName = thisTest.name;

        var promise: Promise<this>;
        if (typeof dynamicTestClass[unitTestName].parameters !== 'undefined') {
            let parameters = dynamicTestClass[unitTestName].parameters;
            promise = this.runAllParameters(thisTest, unitTestName, 0, testRunLimiter);
        } else {
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

    private runAllParameters(
            thisTest:TestDefinition, 
            unitTestName: string, 
            parameterIndex:number, 
            testRunLimiter: ITestRunLimiter
    ):Promise<this> {
        let testClass = thisTest.testClass;
        let dynamicTestClass = <any>testClass;
        let testsGroupName = thisTest.name;
        let parameters = dynamicTestClass[unitTestName].parameters;
        let maxIndex = parameters.length - 1;
        var index = parameterIndex;
        while (index < parameters.length && !testRunLimiter.isParametersSetActive(index)) {
            ++index;
        } 
        if (index < parameters.length) {
            return this.runSingleTestAsync(testClass, unitTestName, testsGroupName, parameters, index)
                .then(() => this.runAllParameters(thisTest, unitTestName, index+1, testRunLimiter));
        }
        return Promise.resolve(this);
    }

    protected runSingleTestAsync(
        testClass: TestClass, 
        unitTestName: string, 
        testsGroupName: string, 
        parameters: any[][] = null, 
        parameterSetIndex: number = null
    ):Promise<this> {
        testClass.setUp && testClass.setUp();

        // running everything inside .then saves us a try/catch
        return Promise.resolve().then(()=>{
            var dynamicTestClass: any = testClass;
            var args = (parameterSetIndex !== null) ? parameters[parameterSetIndex] : null;
            return dynamicTestClass[unitTestName].apply(testClass, args);
        }).then(() => {
            this.passes.push(new TestDescription(testsGroupName, unitTestName, parameterSetIndex, 'OK'));
            return this;
        }, (err:any) => {
            this.errors.push(new TestDescription(testsGroupName, unitTestName, parameterSetIndex, err.toString()));
            return this;
        });
    }

    runAsync(testRunLimiter: ITestRunLimiter = null): Promise<this> {
        var parameters: any[][] = null;
        var testContext = new TestContext();

        if (testRunLimiter == null) {
            testRunLimiter = this.testRunLimiter;
        }

        var tests = this.tests;

        if (testRunLimiter) {
            tests = tests.filter((x) => testRunLimiter.isTestsGroupActive(x.name));
        }

        return this.runAll(tests, testRunLimiter);
    }

    run():this {
        console.log("use runAsync");
        throw new Error("use runAsync");
    }
}