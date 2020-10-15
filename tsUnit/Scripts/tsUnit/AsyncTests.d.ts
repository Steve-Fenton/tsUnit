import { TestClass } from './tsUnitAsync';
export declare class AsyncDeliberateFailureTest extends TestClass {
    testThrowsAndShouldFail(): Promise<never>;
    testOnePlusOneIsThree(): Promise<void>;
}
export declare class AsyncTest extends TestClass {
    testDoNothing(): Promise<void>;
    testSimpleAssertOnAsyncResult(): Promise<void>;
    testExpectedThrow(): Promise<void>;
}
export declare class AsyncParameterizedTest extends TestClass {
    constructor();
    testCheckMultiplication(a: number, b: number): Promise<void>;
}
