/// Vendor Modules
import { assert, expect } from 'chai';

/// TSM Modules
import * as Monads from '../result';

describe('Result', () => {
    // construct the base monadic maybe value
    const value = Monads.Okay<number, string>(Infinity);
    const error = Monads.Failure<number, string>('Not a number!');

    describe('When a type-guard is called', () => {
        it('Should be "okay"', () => assert(value.is('okay')));
        it('Should be "failure"', () => assert(error.is('failure')));
    });

    describe('When a value is unwrapped', () => {
        it('Should throw when "failure"', () => expect(error.unwrap).to.throw());
        it('Should return "0" when "failure" given alt', () => expect(error.unwrap(0)).to.equal(0));
        it('Should return "Infinity" when value is "okay"', () => expect(value.unwrap()).to.equal(Infinity));
    });

    describe('When value is mapped', () => {
        it('Should not change if "failure"', () => assert(error.map(() => 0).is('failure')));
        it('Should change if "okay"', () => expect(value.map(() => 0).unwrap()).to.equal(0));
    });

    describe('When pattern matched', () => {
        const pattern: Monads.IResult.IPattern<number, string, string> = {
            okay: (value) => `Value is ${value}`,
            failure: () => `Empty!`,
        };

        it('Should become "Value is Infinity"', () => expect(value.match(pattern)).to.equal('Value is Infinity'));
        it('Should become "Empty!"', () => expect(error.match(pattern)).to.equal('Empty!'));
    });

    describe('When cast to Maybe', () => {
        it('Should become "none"', () => assert(error.maybe().is('none')));
        it('Should become "some"', () => assert(value.maybe().is('some')));
    });
});
