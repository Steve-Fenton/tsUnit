/// <reference path="tsUnit.ts" />

module BadTests {
    export class DeliberateFailures extends tsUnit.TestClass {
        deliberateBadTest() {
            this.areIdentical('1', 1, 'You can optionally add your own message');
        }
    }
}