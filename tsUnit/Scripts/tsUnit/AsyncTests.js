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
        define(["require", "exports", './tsUnitAsync'], factory);
    }
})(function (require, exports) {
    "use strict";
    var tsUnitAsync_1 = require('./tsUnitAsync');
    var AsyncDeliberateFailureTest = (function (_super) {
        __extends(AsyncDeliberateFailureTest, _super);
        function AsyncDeliberateFailureTest() {
            _super.apply(this, arguments);
        }
        AsyncDeliberateFailureTest.prototype.testThrowsAndShouldFail = function () {
            return Promise.resolve(12).then(function () {
                throw new Error("nothing serious, just checking that exceptions cause failures");
            });
        };
        AsyncDeliberateFailureTest.prototype.testOnePlusOneIsThree = function () {
            var _this = this;
            return Promise.resolve(1 + 1).then(function (x) {
                _this.areIdentical(3, x);
            });
        };
        return AsyncDeliberateFailureTest;
    }(tsUnitAsync_1.TestClass));
    exports.AsyncDeliberateFailureTest = AsyncDeliberateFailureTest;
    var AsyncTest = (function (_super) {
        __extends(AsyncTest, _super);
        function AsyncTest() {
            _super.apply(this, arguments);
        }
        AsyncTest.prototype.testDoNothing = function () {
            return Promise.resolve(12)
                .then(function () { return console.log("should appear before test is finished."); });
        };
        AsyncTest.prototype.testSimpleAssertOnAsyncResult = function () {
            var _this = this;
            return Promise.resolve(12)
                .then(function (x) {
                _this.areIdentical(12, x);
                _this.areNotIdentical(13, x);
            });
        };
        AsyncTest.prototype.testExpectedThrow = function () {
            // instead of this.throws(...); we write sth like:
            var _this = this;
            // tested code (this is a dummy)
            var p = Promise.resolve().then(function () { throw new Error("example exception"); });
            // async tests *must* return a promise
            return p.then(function () {
                _this.fail("expected promise to be rejected, got success");
            }, function (err) {
                _this.areIdentical("example exception", err.message);
            });
        };
        return AsyncTest;
    }(tsUnitAsync_1.TestClass));
    exports.AsyncTest = AsyncTest;
    var AsyncParameterizedTest = (function (_super) {
        __extends(AsyncParameterizedTest, _super);
        function AsyncParameterizedTest() {
            _super.call(this);
            var parameters = [];
            for (var i = 0; i < 10; ++i)
                parameters.push([i, 2 * i]);
            this.parameterizeUnitTest(this.testCheckMultiplication, parameters);
        }
        AsyncParameterizedTest.prototype.testCheckMultiplication = function (a, b) {
            var _this = this;
            return Promise.resolve(a)
                .then(function (x) { return _this.areIdentical(b, 2 * x); });
        };
        return AsyncParameterizedTest;
    }(tsUnitAsync_1.TestClass));
    exports.AsyncParameterizedTest = AsyncParameterizedTest;
});
