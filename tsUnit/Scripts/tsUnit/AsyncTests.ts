///<reference path="./promise.d.ts" />

import { TestClass } from './tsUnitAsync';

export class AsyncDeliberateFailureTest extends TestClass {
  testThrowsAndShouldFail() {
    return Promise.resolve(12).then(() => {
      throw new Error("nothing serious, just checking that exceptions cause failures");
    });
  }
  testOnePlusOneIsThree() {
    return Promise.resolve(1+1).then((x) => {
      this.areIdentical(3, x);
    });
  }
}

export class AsyncTest extends TestClass {
  testDoNothing() {
    return Promise.resolve(12)
      .then(()=>console.log("should appear before test is finished."));
  }
  testSimpleAssertOnAsyncResult() {
    return Promise.resolve(12)
      .then((x)=>{
        this.areIdentical(12, x);
        this.areNotIdentical(13, x);
      });
  }
  testExpectedThrow() {
    // instead of this.throws(...); we write sth like:

    // tested code (this is a dummy)
    let p = Promise.resolve().then(() => { throw new Error("example exception") });

    // async tests *must* return a promise
    return p.then(() => {
      this.fail("expected promise to be rejected, got success");
    }, (err:Error) => {
      this.areIdentical("example exception", err.message);
    })
  }
}

export class AsyncParameterizedTest extends TestClass {
  constructor() {
    super();

    let parameters:number[][] = [];

    for (var i=0; i < 10; ++i) parameters.push([i, 2*i]);

    this.parameterizeUnitTest(this.testCheckMultiplication, parameters);
  }

  testCheckMultiplication(a:number,b:number) {
    return Promise.resolve(a)
      .then((x)=>this.areIdentical(b, 2*x));
  }

}