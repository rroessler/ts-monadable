/// TSM Modules
import { Maybe, None, Some } from './maybe';

/**************
 *  TYPEDEFS  *
 **************/

/** Hidden Typings. */
export namespace IResult {
    /** Available Result States. */
    export type Outcome = 'okay' | 'failure';

    /** Outcome Mapping. */
    export interface IMap<T, E> {
        readonly okay: IOkay<T, E>;
        readonly failure: IFailure<T, E>;
    }

    /** Pattern Matching Interface. */
    export interface IPattern<T, E, U> {
        readonly okay: (value: T) => U;
        readonly failure: (value: E) => U;
    }
}

/** Core Monadic Interface. */
export interface Result<T, E> {
    readonly value: T | E;
    readonly kind: IResult.Outcome;
    is<O extends IResult.Outcome>(kind: O): this is IResult.IMap<T, E>[O];
    unwrap(alternative?: T): T;
    match<U>(fn: IResult.IPattern<T, E, U>): U;
    maybe(): Maybe<T>;
    map<U>(fn: (value: T) => U): Result<U, E>;
    flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
}

/** Okay Result Interface. */
export interface IOkay<T, E = never> extends Result<T, E> {
    readonly value: T;
    readonly kind: 'okay';
    unwrap(): T;
    map<U>(fn: (value: T) => U): IOkay<U, E>;
    match<U>(fn: IResult.IPattern<T, E, U>): U;
}

/** Failure Result Interface. */
export interface IFailure<T, E> extends Result<T, E> {
    readonly value: E;
    readonly kind: 'failure';
    unwrap(alternative?: T): undefined extends T ? never : T;
    map<U>(fn: (value: T) => U): IFailure<U, E>;
    flatMap<U>(fn: (value: T) => Result<U, E>): IFailure<never, E>;
}

/********************
 *  IMPLEMENTATION  *
 ********************/

/** Base Result Implementation. */
class _Result_impl<O extends IResult.Outcome, T, E> implements Result<T, E> {
    /***********************
     *  GETTERS / SETTERS  *
     ***********************/

    /** Gets the internal value instance. */
    get value() {
        return this.m_value as O extends 'okay' ? T : E;
    }

    /******************
     *  CONSTRUCTORS  *
     ******************/

    /**
     * Constructs a generic result instance.
     * @param kind                              Kind of value.
     * @param m_value                           Value instance.
     */
    constructor(readonly kind: O, private m_value: O extends 'okay' ? T : E) {}

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Checks if the result is in a particular state.
     * @param kind                          State to check.
     */
    is<O extends IResult.Outcome>(kind: O): this is IResult.IMap<T, E>[O] {
        return kind === (this.kind as any);
    }

    /**
     * Coordinates unwrapping the monadic value to a suitable return result.
     * @param alternative                   Error alternative
     */
    unwrap(alternative?: T | undefined): T | never {
        if (this.kind === 'okay') return this.m_value as T;
        if (alternative !== undefined) return alternative;
        throw new Error('Monad::Result | Cannot unwrap none!');
    }

    /**
     * Coordinates pattern matching based on the result state.
     * @param fn                            Pattern matcher.
     */
    match<U>(fn: IResult.IPattern<T, E, U>): U {
        return fn[this.kind](this.m_value as any);
    }

    /** Converts a `Result` instance into a `Maybe` monad. */
    maybe(): Maybe<T> {
        return this.is('okay') ? Some(this.value) : None();
    }

    /**
     * Coordinates generating a mapped monadic result.
     * @param fn                            Mapping function.
     */
    map<U>(fn: (value: T) => U): Result<U, E> {
        return this.is('okay') ? Okay(fn(this.value)) : (this as any);
    }

    /**
     * Coordinates generating a flat-map monadic result.
     * @param fn                            Mapping function.
     */
    flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        return this.is('okay') ? fn(this.value) : (this as any);
    }
}

/***************
 *  FACTORIES  *
 ***************/

/**
 * `Result::Okay` Generator.
 * @param value                             Value.
 */
export const Okay = <T, E = never>(value: T): IOkay<T, E> => new _Result_impl<'okay', T, E>('okay', value) as any;

/**
 * `Result::Failure` Generator.
 * @param error                             Error value.
 */
export const Failure = <T, E>(error: E): IFailure<T, E> => new _Result_impl<'failure', T, E>('failure', error) as any;
