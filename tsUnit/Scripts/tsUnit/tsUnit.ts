/* tsUnit (c) Copyright 2012-2015 Steve Fenton, licensed under Apache 2.0 https://github.com/Steve-Fenton/tsUnit */

export class Test {
    public privateMemberPrefix = '_';

    public passes: TestDescription[] = [];
    public errors: TestDescription[] = [];

    protected tests: TestDefinition[] = [];
    protected testRunLimiter: TestRunLimiter;
    private reservedMethodNameContainer: TestClass = new TestClass();

    constructor(...testModules: any[]) {
        this.createTestLimiter();

        for (var i = 0; i < testModules.length; i++) {
            var testModule = testModules[i];
            if (testModule.hasOwnProperty("name")) {
                var name = testModule["name"];
                this.addTestClass(new testModule, name);
            } else {
                for (var prop in testModule) {
                    this.addTestClass(new testModule[prop], prop);
                }
            }

        }
    }

    addTestClass(testClass: TestClass, name: string = 'Tests'): void {
        this.tests.push(new TestDefinition(testClass, name));
    }
    
    run(testRunLimiter: ITestRunLimiter = null) {
        var parameters: any[][] = null;
        var testContext = new TestContext();

        if (testRunLimiter == null) {
            testRunLimiter = this.testRunLimiter;
        }

        for (var i = 0; i < this.tests.length; ++i) {
            var testClass = this.tests[i].testClass;
            var dynamicTestClass = <any>testClass;
            var testsGroupName = this.tests[i].name;

            if (testRunLimiter && !testRunLimiter.isTestsGroupActive(testsGroupName)) {
                continue;
            }

            var propertyNames = FunctionPropertyHelper.getFunctionNames(testClass);
            for (var j = 0; j < propertyNames.length; j++) {
                let unitTestName = propertyNames[j];
                if (this.isReservedFunctionName(unitTestName)
                    || (unitTestName.substring(0, this.privateMemberPrefix.length) === this.privateMemberPrefix)
                    || (typeof dynamicTestClass[unitTestName] !== 'function')
                    || (testRunLimiter && !testRunLimiter.isTestActive(unitTestName))) {
                    continue;
                }

                if (typeof dynamicTestClass[unitTestName].parameters !== 'undefined') {
                    parameters = dynamicTestClass[unitTestName].parameters;
                    for (var parameterIndex = 0; parameterIndex < parameters.length; parameterIndex++) {
                        if (testRunLimiter && !testRunLimiter.isParametersSetActive(parameterIndex)) {
                            continue;
                        }

                        this.runSingleTest(testClass, unitTestName, testsGroupName, parameters, parameterIndex);
                    }
                } else {
                    this.runSingleTest(testClass, unitTestName, testsGroupName);
                }
            }
        }

        return this;
    }

    showResults(target: string | HTMLElement) {
        var elem: HTMLElement;
        if (typeof target === 'string') {
            var id: string = target;
            elem = document.getElementById(id);
        } else {
            elem = target;
        }

        var template = '<article>' +
            '<h1>' + this.getTestResult() + '</h1>' +
            '<p>' + this.getTestSummary() + '</p>' +
            this.testRunLimiter.getLimitCleaner() +
            '<section id="tsFail">' +
            '<h2>Errors</h2>' +
            '<ul class="bad">' + this.getTestResultList(this.errors) + '</ul>' +
            '</section>' +
            '<section id="tsOkay">' +
            '<h2>Passing Tests</h2>' +
            '<ul class="good">' + this.getTestResultList(this.passes) + '</ul>' +
            '</section>' +
            '</article>' +
            this.testRunLimiter.getLimitCleaner();

        elem.innerHTML = template;

        return this;
    }

    getTapResults() {
        var newLine = '\r\n';
        var template = '1..' + (this.passes.length + this.errors.length).toString() + newLine;

        for (var i = 0; i < this.errors.length; i++) {
            template += 'not ok ' + this.errors[i].message + ' ' + this.errors[i].testName + newLine;
        }

        for (var i = 0; i < this.passes.length; i++) {
            template += 'ok ' + this.passes[i].testName + newLine;
        }

        return template;
    }

    private createTestLimiter() {
        try {
            if (typeof window !== 'undefined') {
                this.testRunLimiter = new TestRunLimiter();
            }
        } catch (ex) { }
    }

    protected isReservedFunctionName(functionName: string): boolean {
        return FunctionPropertyHelper
            .getFunctionNames(this.reservedMethodNameContainer)
            .some(mem => mem === functionName);
    }

    private runSingleTest(testClass: TestClass, unitTestName: string, testsGroupName: string, parameters: any[][] = null, parameterSetIndex: number = null) {
        if (typeof testClass['setUp'] === 'function') {
            testClass['setUp']();
        }

        try {
            var dynamicTestClass: any = testClass;
            var args = (parameterSetIndex !== null) ? parameters[parameterSetIndex] : null;
            dynamicTestClass[unitTestName].apply(testClass, args);

            this.passes.push(new TestDescription(testsGroupName, unitTestName, parameterSetIndex, 'OK'));
        } catch (err) {
            this.errors.push(new TestDescription(testsGroupName, unitTestName, parameterSetIndex, err.toString()));
        }

        if (typeof testClass['tearDown'] === 'function') {
            testClass['tearDown']();
        }
    }

    private getTestResult() {
        return this.errors.length === 0 ? 'Test Passed' : 'Test Failed';
    }

    private getTestSummary() {
        return 'Total tests: <span id="tsUnitTotalCout">' + (this.passes.length + this.errors.length).toString() + '</span>. ' +
            'Passed tests: <span id="tsUnitPassCount" class="good">' + this.passes.length + '</span>. ' +
            'Failed tests: <span id="tsUnitFailCount" class="bad">' + this.errors.length + '</span>.';
    }

    private getTestResultList(testResults: TestDescription[]) {
        var list = '';
        var group = '';
        var isFirst = true;
        for (var i = 0; i < testResults.length; ++i) {
            var result = testResults[i];
            if (result.testName !== group) {
                group = result.testName;
                if (isFirst) {
                    isFirst = false;
                } else {
                    list += '</li></ul>';
                }
                list += '<li>' + this.testRunLimiter.getLimiterForGroup(group) + result.testName + '<ul>';
            }

            var resultClass = (result.message === 'OK') ? 'success' : 'error';
            var functionLabal = result.funcName + ((result.parameterSetNumber === null)
                ? '()'
                : '(' + this.testRunLimiter.getLimiterForTest(group, result.funcName, result.parameterSetNumber) + ' paramater set: ' + result.parameterSetNumber + ')');

            list += '<li class="' + resultClass + '">' + this.testRunLimiter.getLimiterForTest(group, result.funcName) + functionLabal + ': ' + this.encodeHtmlEntities(result.message) + '</li>';
        }
        return list + '</ul>';
    }

    private encodeHtmlEntities(input: string) {
        return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
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

class TestRunLimiterRunAll implements ITestRunLimiter {
    isTestsGroupActive(groupName: string): boolean {
        return true;
    }

    isTestActive(testName: string): boolean {
        return true;
    }

    isParametersSetActive(paramatersSetNumber: number): boolean {
        return true;
    }
}

export class TestRunLimiter implements ITestRunLimiter {
    private groupName: string = null;
    private testName: string = null;
    private parameterSet: number = null;

    constructor() {
        this.setRefreshOnLinksWithHash();
        this.translateStringIntoTestsLimit(window.location.hash);
    }

    public isTestsGroupActive(groupName: string): boolean {
        if (this.groupName === null) {
            return true;
        }

        return this.groupName === groupName;
    }

    public isTestActive(testName: string): boolean {
        if (this.testName === null) {
            return true;
        }

        return this.testName === testName;
    }

    public isParametersSetActive(paramatersSet: number): boolean {
        if (this.parameterSet === null) {
            return true;
        }

        return this.parameterSet === paramatersSet;
    }

    public getLimiterForTest(groupName: string, testName: string, parameterSet: number = null): string {
        if (parameterSet !== null) {
            testName += '(' + parameterSet + ')';
        }

        return '&nbsp;<a href="#' + groupName + '/' + testName + '\" class="ascii">&#9658;</a>&nbsp;';
    }

    public getLimiterForGroup(groupName: string): string {
        return '&nbsp;<a href="#' + groupName + '" class="ascii">&#9658;</a>&nbsp;';
    }

    public getLimitCleaner(): string {
        return '<p><a href="#">Run all tests <span class="ascii">&#9658;</span></a></p>';
    }

    private setRefreshOnLinksWithHash() {
        var previousHandler = window.onhashchange;

        window.onhashchange = function (ev: HashChangeEvent) {
            window.location.reload();

            if (typeof previousHandler === 'function') {
                previousHandler.call(window, ev);
            }
        };
    }

    private translateStringIntoTestsLimit(value: string) {
        var regex = /^#([_a-zA-Z0-9]+)((\/([_a-zA-Z0-9]+))(\(([0-9]+)\))?)?$/
        var result = regex.exec(value);

        if (result === null) {
            return;
        }

        if (result.length > 1 && !!result[1]) {
            this.groupName = result[1];
        }

        if (result.length > 4 && !!result[4]) {
            this.testName = result[4];
        }

        if (result.length > 6 && !!result[6]) {
            this.parameterSet = parseInt(result[6], 10);
        }
    }
}

export class TestContext {
    setUp() {
    }

    tearDown() {
    }

    protected areIdentical(expected: any, actual: any, message = ''): void {
        if (expected !== actual) {
            throw this.getError('areIdentical failed when given ' +
                this.printVariable(expected) + ' and ' + this.printVariable(actual),
                message);
        }
    }

    protected areNotIdentical(expected: any, actual: any, message = ''): void {
        if (expected === actual) {
            throw this.getError('areNotIdentical failed when given ' +
                this.printVariable(expected) + ' and ' + this.printVariable(actual),
                message);
        }
    }

    protected areCollectionsIdentical(expected: any[], actual: any[], message = ''): void {
        function resultToString(result: number[]): string {
            var msg = '';

            while (result.length > 0) {
                msg = '[' + result.pop() + ']' + msg;
            }

            return msg;
        }

        var compareArray = (expected: any[], actual: any[], result: number[]): void => {
            var indexString = '';

            if (expected === null) {
                if (actual !== null) {
                    indexString = resultToString(result);
                    throw this.getError('areCollectionsIdentical failed when array a' +
                        indexString + ' is null and b' +
                        indexString + ' is not null',
                        message);
                }

                return; // correct: both are nulls
            } else if (actual === null) {
                indexString = resultToString(result);
                throw this.getError('areCollectionsIdentical failed when array a' +
                    indexString + ' is not null and b' +
                    indexString + ' is null',
                    message);
            }

            if (expected.length !== actual.length) {
                indexString = resultToString(result);
                throw this.getError('areCollectionsIdentical failed when length of array a' +
                    indexString + ' (length: ' + expected.length + ') is different of length of array b' +
                    indexString + ' (length: ' + actual.length + ')',
                    message);
            }

            for (var i = 0; i < expected.length; i++) {
                if ((expected[i] instanceof Array) && (actual[i] instanceof Array)) {
                    result.push(i);
                    compareArray(expected[i], actual[i], result);
                    result.pop();
                } else if (expected[i] !== actual[i]) {
                    result.push(i);
                    indexString = resultToString(result);
                    throw this.getError('areCollectionsIdentical failed when element a' +
                        indexString + ' (' + this.printVariable(expected[i]) + ') is different than element b' +
                        indexString + ' (' + this.printVariable(actual[i]) + ')',
                        message);
                }
            }

            return;
        }

        compareArray(expected, actual, []);
    }

    protected areCollectionsNotIdentical(expected: any[], actual: any[], message = ''): void {
        try {
            this.areCollectionsIdentical(expected, actual);
        } catch (ex) {
            return;
        }

        throw this.getError('areCollectionsNotIdentical failed when both collections are identical', message);
    }

    protected isTrue(actual: boolean, message = '') {
        if (!actual) {
            throw this.getError('isTrue failed when given ' + this.printVariable(actual), message);
        }
    }

    protected isFalse(actual: boolean, message = '') {
        if (actual) {
            throw this.getError('isFalse failed when given ' + this.printVariable(actual), message);
        }
    }

    protected isTruthy(actual: any, message = '') {
        if (!actual) {
            throw this.getError('isTrue failed when given ' + this.printVariable(actual), message);
        }
    }

    protected isFalsey(actual: any, message = '') {
        if (actual) {
            throw this.getError('isFalse failed when given ' + this.printVariable(actual), message);
        }
    }

    protected throws(params: IThrowsParameters): void;
    protected throws(actual: () => void, message?: string): void;
    protected throws(a: any, message = '', errorString = '') {
        var actual: () => void;

        if (typeof a === 'function') {
            actual = a;
        } else if (a.fn) {
            actual = a.fn;
            message = a.message;
            errorString = a.exceptionString;
        }

        var isThrown = false;
        try {
            actual();
        } catch (ex) {
            if (!errorString || ex.message === errorString) {
                isThrown = true;
            }

            if (errorString && ex.message !== errorString) {
                throw this.getError('different error string than supplied');
            }

        }
        if (!isThrown) {
            throw this.getError('did not throw an error', message || '');
        }
    }

    protected doesNotThrow(actual: () => void, message?: string): void {
        try {
            actual();
        } catch (ex) {
            throw this.getError('threw an error ' + ex, message || '');
        }
    }

    protected executesWithin(actual: () => void, timeLimit: number, message: string = null): void {
        function getTime() {
            return window.performance.now();
        }

        function timeToString(value: number) {
            return Math.round(value * 100) / 100;
        }

        var startOfExecution = getTime();

        try {
            actual();
        } catch (ex) {
            throw this.getError('isExecuteTimeLessThanLimit fails when given code throws an exception: "' + ex + '"', message);
        }

        var executingTime = getTime() - startOfExecution;
        if (executingTime > timeLimit) {
            throw this.getError('isExecuteTimeLessThanLimit fails when execution time of given code (' + timeToString(executingTime) + ' ms) ' +
                'exceed the given limit(' + timeToString(timeLimit) + ' ms)',
                message);
        }
    }

    protected fail(message = '') {
        throw this.getError('fail', message);
    }

    private getError(resultMessage: string, message: string = '') {
        if (message) {
            return new Error(resultMessage + '. ' + message);
        }

        return new Error(resultMessage);
    }

    private static getNameOfClass(inputClass: {}) {
        // see: https://www.stevefenton.co.uk/Content/Blog/Date/201304/Blog/Obtaining-A-Class-Name-At-Runtime-In-TypeScript/
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((<any>inputClass).constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }

    private printVariable(variable: any) {
        if (variable === null) {
            return '"null"';
        }

        if (typeof variable === 'object') {
            return '{object: ' + TestContext.getNameOfClass(variable) + '}';
        }

        return '{' + (typeof variable) + '} "' + variable + '"';
    }
}

export class TestClass extends TestContext {
    protected parameterizeUnitTest(method: Function, parametersArray: any[][]) {
        (<any>method).parameters = parametersArray;
    }
}

export class FakeFactory {
    static getFake<T>(obj: any, ...implementations: [string, any][]): T {
        var fakeType: any = function () { };
        this.populateFakeType(fakeType, obj);
        var fake: any = new fakeType();

        var propertyNames = FunctionPropertyHelper.getAllPropertyNames(obj);
        for (var k = 0; k < propertyNames.length; k++) {
            fake[propertyNames[k]] = function () { console.log('Default fake called.'); };
        }
        var memberNameIndex = 0;
        var memberValueIndex = 1;

        for (var i = 0; i < implementations.length; i++) {
            var impl = implementations[i];
            fake[impl[memberNameIndex]] = impl[memberValueIndex];
        }

        return <T>fake;
    }

    private static populateFakeType(fake: any, toCopy: any) {

        let properties = FunctionPropertyHelper.getAllPropertyNames(toCopy);
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            fake[property] = toCopy[property];
            
        }

        var __: any = function () {
            this.constructor = fake;
        }

        __.prototype = toCopy.prototype;

        fake.prototype = new __();
    }
}

export class TestDefinition {
    constructor(public testClass: TestClass, public name: string) {
    }
}

export class TestDescription {
    constructor(public testName: string, public funcName: string, public parameterSetNumber: number, public message: string) {
    }
}

export class FunctionPropertyHelper {
    static walkImpl(obj: any, results: Set<string>): void {
        if (obj == null) {
            return;
        }
        const ownPropertiesOfObj = Object.getOwnPropertyNames(obj);
        ownPropertiesOfObj.forEach(mem => results.add(mem));
        const prototype = Object.getPrototypeOf(obj);
        if (prototype == null) {
            return null;
        }
        const propNames = Object.getOwnPropertyNames(prototype);
        propNames.forEach(mem => results.add(mem));
        this.walkImpl(obj.prototype, results);
        this.walkImpl(prototype, results);
    }
    static walk(obj: any) : string[]{
        const results = new Set<string>();
        this.walkImpl(obj, results);
        return Array.from(results);
    }
    static getFunctionNames(type: any): string[] {
        return this.walk(type)
            .filter(mem => {
                var method = type[mem];
                return method instanceof Function &&
                    (method !== type &&
                    method.prototype !==
                    Object
                    .getPrototypeOf(type));

            });

    }
    static getAllPropertyNames(type: any): string[] {
        let properties = this.walk(type);
        if (typeof type === "function") {
            var functionProps = this.walk(Function);
            return properties.filter(mem => !functionProps.some(funcProp => funcProp === mem));
        }
        return properties.filter(mem => {
            var method = type[mem];
            return method !== type &&
                    method.prototype !==
                    Object
                        .getPrototypeOf(type);

        });
    }
}