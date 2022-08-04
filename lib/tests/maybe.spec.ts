/// Vendor Modules
import { assert, expect } from 'chai';

/// TSM Modules
import * as Monads from '../maybe';

describe('Maybe', () => {
    // construct the base monadic maybe value
    const value = Monads.Some('Hello');
    const none = Monads.None<string>();

    describe('When a type-guard is called', () => {
        it('Should be "none"', () => assert(none.is('none')));
        it('Should be "some"', () => assert(value.is('some')));
    });

    describe('When a value is unwrapped', () => {
        it('Should throw when "none"', () => expect(none.unwrap).to.throw());
        it('Should return "Hello" when "none" given alternative', () => expect(none.unwrap('Hello')).to.equal('Hello'));
        it('Should return "Hello" when value is "some"', () => expect(value.unwrap()).to.equal('Hello'));
    });

    describe('When value is mapped', () => {
        it('Should not change if "none"', () => assert(none.map(() => 'Goodbye').is('none')));
        it('Should change if "some"', () => expect(value.map(() => 'Goodbye').unwrap()).to.equal('Goodbye'));
    });

    describe('When pattern matched', () => {
        const pattern: Monads.IMaybe.IPattern<string, string> = {
            none: () => 'Hello, Monads',
            some: (value) => `${value}, TypeScript`,
        };

        it('Should become "Hello, TypeScript"', () => expect(value.match(pattern)).to.equal('Hello, TypeScript'));
        it('Should become "Hello, Monads"', () => expect(none.match(pattern)).to.equal('Hello, Monads'));
    });
});
