define(["require", "exports", './tsUnitAsync'], function (require, exports, tsUnitAsync_1) {
    "use strict";
    class AsyncDeliberateFailureTest extends tsUnitAsync_1.TestClass {
        testThrowsAndShouldFail() {
            return Promise.resolve(12).then(() => {
                throw new Error("nothing serious, just checking that exceptions cause failures");
            });
        }
        testOnePlusOneIsThree() {
            return Promise.resolve(1 + 1).then((x) => {
                this.areIdentical(3, x);
            });
        }
    }
    exports.AsyncDeliberateFailureTest = AsyncDeliberateFailureTest;
    class AsyncTest extends tsUnitAsync_1.TestClass {
        testDoNothing() {
            return Promise.resolve(12)
                .then(() => console.log("should appear before test is finished."));
        }
        testSimpleAssertOnAsyncResult() {
            return Promise.resolve(12)
                .then((x) => {
                this.areIdentical(12, x);
                this.areNotIdentical(13, x);
            });
        }
        testExpectedThrow() {
            // instead of this.throws(...); we write sth like:
            // tested code (this is a dummy)
            let p = Promise.resolve().then(() => { throw new Error("example exception"); });
            // async tests *must* return a promise
            return p.then(() => {
                this.fail("expected promise to be rejected, got success");
            }, (err) => {
                this.areIdentical("example exception", err.message);
            });
        }
    }
    exports.AsyncTest = AsyncTest;
    class AsyncParameterizedTest extends tsUnitAsync_1.TestClass {
        constructor() {
            super();
            let parameters = [];
            for (var i = 0; i < 10; ++i)
                parameters.push([i, 2 * i]);
            this.parameterizeUnitTest(this.testCheckMultiplication, parameters);
        }
        testCheckMultiplication(a, b) {
            return Promise.resolve(a)
                .then((x) => this.areIdentical(b, 2 * x));
        }
    }
    exports.AsyncParameterizedTest = AsyncParameterizedTest;
});
