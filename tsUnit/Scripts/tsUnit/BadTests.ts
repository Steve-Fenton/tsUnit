import * as tsUnit from './tsunit';

export class DeliberateFailures extends tsUnit.TestClass {
    deliberateBadTest() {
        this.areIdentical('1', 1, 'You can optionally add your own message');
    }

    negativeCaseThatShouldFail() {
        this.throws(() => {
            console.log('I don\'t throw, so I should fail');
        });
    }
}
