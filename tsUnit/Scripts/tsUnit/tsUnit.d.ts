export declare class Test {
    privateMemberPrefix: string;
    passes: TestDescription[];
    errors: TestDescription[];
    protected tests: TestDefinition[];
    protected testRunLimiter: TestRunLimiter;
    private reservedMethodNameContainer;
    constructor(...testModules: any[]);
    addTestClass(testClass: TestClass, name?: string): void;
    run(testRunLimiter?: ITestRunLimiter): this;
    showResults(target: string | HTMLElement): this;
    getTapResults(): string;
    private createTestLimiter;
    protected isReservedFunctionName(functionName: string): boolean;
    private runSingleTest;
    private getTestResult;
    private getTestSummary;
    private getTestResultList;
    private encodeHtmlEntities;
}
export interface ITestRunLimiter {
    isTestsGroupActive(groupName: string): boolean;
    isTestActive(testName: string): boolean;
    isParametersSetActive(paramatersSetNumber: number): boolean;
}
export interface IThrowsParameters {
    fn: () => void;
    message?: string;
    errorString?: string;
}
export declare class TestRunLimiter implements ITestRunLimiter {
    private groupName;
    private testName;
    private parameterSet;
    constructor();
    isTestsGroupActive(groupName: string): boolean;
    isTestActive(testName: string): boolean;
    isParametersSetActive(paramatersSet: number): boolean;
    getLimiterForTest(groupName: string, testName: string, parameterSet?: number): string;
    getLimiterForGroup(groupName: string): string;
    getLimitCleaner(): string;
    private setRefreshOnLinksWithHash;
    private translateStringIntoTestsLimit;
}
export declare class TestContext {
    setUp(): void;
    tearDown(): void;
    protected areIdentical(expected: any, actual: any, message?: string): void;
    protected areNotIdentical(expected: any, actual: any, message?: string): void;
    protected areCollectionsIdentical(expected: any[], actual: any[], message?: string): void;
    protected areCollectionsNotIdentical(expected: any[], actual: any[], message?: string): void;
    protected isTrue(actual: boolean, message?: string): void;
    protected isFalse(actual: boolean, message?: string): void;
    protected isTruthy(actual: any, message?: string): void;
    protected isFalsey(actual: any, message?: string): void;
    protected throws(params: IThrowsParameters): void;
    protected throws(actual: () => void, message?: string): void;
    protected doesNotThrow(actual: () => void, message?: string): void;
    protected executesWithin(actual: () => void, timeLimit: number, message?: string): void;
    protected fail(message?: string): void;
    private getError;
    private static getNameOfClass;
    private printVariable;
}
export declare class TestClass extends TestContext {
    protected parameterizeUnitTest(method: Function, parametersArray: any[][]): void;
}
export declare class FakeFactory {
    static getFake<T>(obj: any, ...implementations: [string, any][]): T;
    private static populateFakeType;
}
export declare class TestDefinition {
    testClass: TestClass;
    name: string;
    constructor(testClass: TestClass, name: string);
}
export declare class TestDescription {
    testName: string;
    funcName: string;
    parameterSetNumber: number;
    message: string;
    constructor(testName: string, funcName: string, parameterSetNumber: number, message: string);
}
export declare class FunctionPropertyHelper {
    static walkImpl(obj: any, results: Set<string>): void;
    static walk(obj: any): string[];
    static getFunctionNames(type: any): string[];
    static getAllPropertyNames(type: any): string[];
}
