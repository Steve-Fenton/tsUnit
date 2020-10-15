import * as tsUnit from './tsUnit';
export declare class RealClass {
    name: string;
    run(): boolean;
    returnValue(): RealClass;
}
export declare class TearDownAndSetUpTests extends tsUnit.TestClass {
    testOfSetUp(): void;
    testOfSetUpWithParameters(): void;
    testOfTearDown(): void;
    testTearDownWithFailedTest(): void;
    testTearDownWithParameters(): void;
}
export declare class FakeFactoryTests extends tsUnit.TestClass {
    callDefaultFunctionOnFake(): void;
    callSubstituteFunctionOnFake(): void;
    callSubstituteFunctionToObtainSecondFake(): void;
    callDefaultPropertyOnFake(): void;
    callSubstitutePropertyOnFake(): void;
}
export declare class PrivateMembersOnly extends tsUnit.TestClass {
    private _privateMethod;
    publicMethod(): void;
}
export declare class AssertAreIdenticalTests extends tsUnit.TestClass {
    withIdenticalNumbers(): void;
    withDifferentNumbers(): void;
    withIdenticalStings(): void;
    withDifferentStrings(): void;
    withSameInstance(): void;
    withDifferentInstance(): void;
    withDifferentTypes(): void;
    withIdenticalCollections(): void;
    withDifferentCollections(): void;
}
export declare class AssertAreNotIdenticalTests extends tsUnit.TestClass {
    withIdenticalNumbers(): void;
    withDifferentNumbers(): void;
    withIdenticalStrings(): void;
    withDifferentStrings(): void;
    withSameInstance(): void;
    withDifferentInstance(): void;
    withDifferentTypes(): void;
    withIdenticalCollections(): void;
    withDifferentCollections(): void;
}
export declare class IsTrueTests extends tsUnit.TestClass {
    withBoolTrue(): void;
    withBoolFalse(): void;
}
export declare class IsFalseTests extends tsUnit.TestClass {
    withBoolFalse(): void;
    withBoolTrue(): void;
}
export declare class IsTruthyTests extends tsUnit.TestClass {
    withBoolTrue(): void;
    withNonEmptyString(): void;
    withTrueString(): void;
    with1(): void;
    withBoolFalse(): void;
    withEmptyString(): void;
    withZero(): void;
    withNull(): void;
    withUndefined(): void;
}
export declare class IsFalseyTests extends tsUnit.TestClass {
    withBoolFalse(): void;
    withEmptyString(): void;
    withZero(): void;
    withNull(): void;
    withUndefined(): void;
    withBoolTrue(): void;
    withNonEmptyString(): void;
    withTrueString(): void;
    with1(): void;
}
export declare class FailTests extends tsUnit.TestClass {
    expectFails(): void;
}
export declare class ExecutesWithinTests extends tsUnit.TestClass {
    withFastFunction(): void;
    withSlowFunction(): void;
    withFailingFunction(): void;
}
export declare class ParameterizedTests extends tsUnit.TestClass {
    constructor();
    sumTests(a: number, b: number, sum: number): void;
    nonSumTests(a: number, b: number, notsum: number): void;
    normalTest(): void;
}
export declare class ThrowsTests extends tsUnit.TestClass {
    functionsFails(): void;
    innerFunctionsDoesntFails(): void;
    functionsFailsWithSpecificErrorMessage(): void;
    functionsDoesntFailsWithMessage(): void;
    functionsFailsWithDifferentErrorMessage(): void;
    functionsFailsWithUndefinedParam(): void;
    functionsFailsWithNullParam(): void;
}
export declare class DoesNotThrowTests extends tsUnit.TestClass {
    doesNotThrowPassingTest(): void;
    functionsFails(): void;
}
