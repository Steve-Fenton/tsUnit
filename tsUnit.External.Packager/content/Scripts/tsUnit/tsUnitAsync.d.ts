import { Test, TestClass, ITestRunLimiter } from './tsUnit';
export { Test, TestContext, TestClass, FakeFactory, ITestRunLimiter, TestDescription, TestDefinition } from './tsUnit';
export declare class TestAsync extends Test {
    private _currentTestPromises;
    private runAll;
    private runAllFunctions;
    private runAllParameters;
    protected runSingleTestAsync(testClass: TestClass, unitTestName: string, testsGroupName: string, parameters?: any[][], parameterSetIndex?: number): Promise<this>;
    runAsync(testRunLimiter?: ITestRunLimiter): Promise<this>;
    run(): this;
}
